import re
import os
import json
import logging
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, asdict
import numpy as np

logger = logging.getLogger(__name__)


@dataclass
class FalsificationDossier:
    """
    Formal Empirical Falsification Dossier according to Equation in Section 4.3:
    D_falsify = < c_claim, s_prior, E_metrics, Delta_divergence >
    Routes verified empirical contradictions directly to the Critic Agent committee.
    """
    claim: str
    prior_literature: str
    metrics: Dict[str, Any]
    delta_divergence: float
    is_falsification_anomaly: bool = True

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

# Try importing NLTK sentence tokenizer with regex fallback
try:
    import nltk
    from nltk.tokenize import sent_tokenize
except ImportError:
    sent_tokenize = None

# Global cache for NLI model and Embedding model
_NLI_MODEL = None
_EMBED_MODEL = None
_NLI_LOAD_ATTEMPTED = False


def _get_embedding_model():
    """Lazily load SentenceTransformer embedding model."""
    global _EMBED_MODEL
    if _EMBED_MODEL is None:
        try:
            from sentence_transformers import SentenceTransformer
            _EMBED_MODEL = SentenceTransformer("all-MiniLM-L6-v2")
        except Exception as e:
            logger.warning(f"Could not load SentenceTransformer: {e}")
            _EMBED_MODEL = None
    return _EMBED_MODEL


def _get_nli_model():
    """Lazily load CrossEncoder for NLI when explicitly enabled via ENABLE_DEBERTA_NLI=true."""
    global _NLI_MODEL, _NLI_LOAD_ATTEMPTED
    if _NLI_MODEL is None and not _NLI_LOAD_ATTEMPTED:
        _NLI_LOAD_ATTEMPTED = True
        enable_heavy = os.getenv("ENABLE_DEBERTA_NLI", "false").lower() in ("true", "1")
        if enable_heavy:
            try:
                from sentence_transformers import CrossEncoder
                _NLI_MODEL = CrossEncoder("cross-encoder/nli-deberta-v3-small")
                logger.info("Successfully loaded NLI CrossEncoder (nli-deberta-v3-small)")
            except Exception as e:
                logger.info(f"NLI CrossEncoder could not load ({e}). Using semantic entailment engine.")
                _NLI_MODEL = None
        else:
            # Default to ultra-fast local semantic entailment engine
            _NLI_MODEL = None
    return _NLI_MODEL


def split_sentences(text: str) -> List[str]:
    """Split text into individual atomic sentences/claims."""
    if not text or not text.strip():
        return []
    
    # Strip markdown headers, bullet points, numbers
    cleaned_lines = []
    for line in text.splitlines():
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        line = re.sub(r'^[0-9]+[\.\)]\s*', '', line)
        line = re.sub(r'^[\*\-\•]\s*', '', line)
        if line:
            cleaned_lines.append(line)
    
    cleaned_text = " ".join(cleaned_lines)
    
    if sent_tokenize:
        try:
            sentences = sent_tokenize(cleaned_text)
            return [s.strip() for s in sentences if len(s.strip()) > 10]
        except Exception:
            pass

    # Regex fallback
    sentences = re.split(r'(?<=[.!?])\s+(?=[A-Z0-9])', cleaned_text)
    return [s.strip() for s in sentences if len(s.strip()) > 10]


def extract_numbers_and_metrics(text: str) -> set:
    """Extract quantitative values, percentages, and metrics to detect numerical hallucinations."""
    tokens = re.findall(r'\b\d+(?:\.\d+)?%?(?:x|k|m|b|gb|mb|w)?\b', text.lower())
    return set(tokens)


def compute_semantic_entailment(claim: str, source_sentences: List[str]) -> Dict[str, Any]:
    """
    Mathematical Entailment Verification:
    1. Computes dense semantic similarity between claim and candidate source sentences.
    2. Checks for numerical consistency (detects hallucinated numbers/metrics).
    3. Detects contradiction indicators (negation polarity mismatch).
    """
    embedder = _get_embedding_model()
    
    if not source_sentences:
        return {
            "verdict": "NEUTRAL",
            "confidence": 0.5,
            "matched_source_span": "",
            "explanation": "No source sentences available for verification."
        }
        
    if embedder is not None:
        claim_emb = embedder.encode([claim], convert_to_numpy=True)
        source_embs = embedder.encode(source_sentences, convert_to_numpy=True)
        
        # Compute cosine similarities
        norms_claim = np.linalg.norm(claim_emb, axis=1, keepdims=True) + 1e-9
        norms_src = np.linalg.norm(source_embs, axis=1, keepdims=True) + 1e-9
        similarities = np.dot(claim_emb / norms_claim, (source_embs / norms_src).T)[0]
        
        best_idx = int(np.argmax(similarities))
        max_sim = float(similarities[best_idx])
        best_source_span = source_sentences[best_idx]
    else:
        # Lexical Jaccard Fallback
        claim_words = set(claim.lower().split())
        best_sim = 0.0
        best_source_span = source_sentences[0]
        for s in source_sentences:
            s_words = set(s.lower().split())
            jaccard = len(claim_words & s_words) / (len(claim_words | s_words) + 1e-9)
            if jaccard > best_sim:
                best_sim = jaccard
                best_source_span = s
        max_sim = best_sim

    # Quantitative consistency check
    claim_nums = extract_numbers_and_metrics(claim)
    source_nums = extract_numbers_and_metrics(best_source_span)
    
    unsupported_nums = claim_nums - source_nums
    has_numerical_hallucination = len(unsupported_nums) > 0 and len(claim_nums) > 0

    # Contradiction polarity heuristics
    negations = {"not", "no", "never", "cannot", "fails", "failed", "unlikely", "inability"}
    claim_neg = len(set(claim.lower().split()) & negations) > 0
    source_neg = len(set(best_source_span.lower().split()) & negations) > 0
    polarity_mismatch = (claim_neg != source_neg) and max_sim > 0.65

    # Determine Verdict
    if polarity_mismatch:
        verdict = "CONTRADICTION"
        confidence = round(max_sim, 3)
        explanation = f"Contradiction detected: Negation polarity mismatch against source claim."
    elif has_numerical_hallucination:
        verdict = "CONTRADICTION"
        confidence = 0.85
        explanation = f"Numerical Hallucination: Metrics {list(unsupported_nums)} not found in cited source text."
    elif max_sim >= 0.70:
        verdict = "ENTAILMENT"
        confidence = round(max_sim, 3)
        explanation = f"Grounded: Semantically entailed by source evidence ({round(max_sim * 100, 1)}% match)."
    elif max_sim >= 0.45:
        verdict = "NEUTRAL"
        confidence = round(max_sim, 3)
        explanation = f"Unverified: Partially relevant, but lacks direct entailment proof ({round(max_sim * 100, 1)}% match)."
    else:
        verdict = "NEUTRAL"
        confidence = round(1.0 - max_sim, 3)
        explanation = "Uncited / Unsupported: No corresponding evidence found in source text."

    falsification_dossier = None
    if verdict == "CONTRADICTION":
        dossier = FalsificationDossier(
            claim=claim,
            prior_literature=best_source_span,
            metrics={"contradiction_confidence": float(confidence), "polarity_mismatch": bool(polarity_mismatch)},
            delta_divergence=round(float(confidence), 3),
            is_falsification_anomaly=True
        )
        falsification_dossier = dossier.to_dict()

    return {
        "verdict": verdict,
        "confidence": confidence,
        "matched_source_span": best_source_span,
        "explanation": explanation,
        "falsification_dossier": falsification_dossier
    }


class CitationVerifier:
    """
    State-of-the-art Provable Citation & Factuality Verification Engine.
    Decomposes LLM-generated scientific text into atomic propositions and checks
    mathematical entailment against ground-truth source literature.
    """

    def __init__(self):
        self.nli_model = _get_nli_model()

    def verify_claim(self, claim: str, source_text: str) -> Dict[str, Any]:
        """Verify an individual scientific claim against source text."""
        source_sentences = split_sentences(source_text)
        if not source_sentences:
            return {
                "claim": claim,
                "verdict": "NEUTRAL",
                "confidence": 0.0,
                "matched_source_span": "",
                "explanation": "Source text contains no parseable sentences."
            }

        # If NLI cross-encoder is loaded, use neural NLI
        if self.nli_model is not None:
            try:
                pairs = [[s, claim] for s in source_sentences]
                scores = self.nli_model.predict(pairs)
                # Model outputs logits for [Contradiction, Entailment, Neutral]
                # Softmax to probabilities
                exp_scores = np.exp(scores - np.max(scores, axis=-1, keepdims=True))
                probs = exp_scores / np.sum(exp_scores, axis=-1, keepdims=True)
                
                # Find sentence with highest entailment
                entailment_scores = probs[:, 1]
                best_idx = int(np.argmax(entailment_scores))
                best_probs = probs[best_idx]
                labels = ["CONTRADICTION", "ENTAILMENT", "NEUTRAL"]
                best_label = labels[int(np.argmax(best_probs))]
                best_span = source_sentences[best_idx]
                
                falsification_dossier = None
                if best_label == "CONTRADICTION":
                    dossier = FalsificationDossier(
                        claim=claim,
                        prior_literature=best_span,
                        metrics={"nli_label": best_label, "confidence": round(float(np.max(best_probs)), 3)},
                        delta_divergence=round(float(np.max(best_probs)), 3),
                        is_falsification_anomaly=True
                    )
                    falsification_dossier = dossier.to_dict()

                return {
                    "claim": claim,
                    "verdict": best_label,
                    "confidence": round(float(np.max(best_probs)), 3),
                    "matched_source_span": best_span,
                    "explanation": f"Neural NLI classification: {best_label} (Confidence: {round(float(np.max(best_probs)) * 100, 1)}%)",
                    "falsification_dossier": falsification_dossier
                }
            except Exception as e:
                logger.warning(f"Neural NLI inference failed: {e}. Falling back to semantic entailment.")

        # High-precision Semantic Entailment Engine
        result = compute_semantic_entailment(claim, source_sentences)
        return {
            "claim": claim,
            "verdict": result["verdict"],
            "confidence": result["confidence"],
            "matched_source_span": result["matched_source_span"],
            "explanation": result["explanation"],
            "falsification_dossier": result.get("falsification_dossier")
        }

    def verify_document(self, generated_text: str, source_text: str) -> Dict[str, Any]:
        """
        Verify an entire generated document (abstract, summary, proposal, or review)
        against source literature. Returns atomic verification cards and aggregate metrics.
        """
        claims = split_sentences(generated_text)
        if not claims:
            return {
                "total_claims": 0,
                "grounding_score": 100.0,
                "hallucination_rate": 0.0,
                "risk_level": "LOW",
                "verified_claims": []
            }

        verified_claims = []
        entailed_count = 0
        contradicted_count = 0
        neutral_count = 0

        for idx, claim in enumerate(claims):
            verification = self.verify_claim(claim, source_text)
            verification["claim_index"] = idx + 1
            verified_claims.append(verification)

            if verification["verdict"] == "ENTAILMENT":
                entailed_count += 1
            elif verification["verdict"] == "CONTRADICTION":
                contradicted_count += 1
            else:
                neutral_count += 1

        total = len(claims)
        grounding_score = round((entailed_count / total) * 100.0, 1) if total > 0 else 0.0
        hallucination_rate = round(((contradicted_count + (neutral_count * 0.5)) / total) * 100.0, 1) if total > 0 else 0.0

        if grounding_score >= 80.0:
            risk_level = "LOW"
        elif grounding_score >= 55.0:
            risk_level = "MODERATE"
        else:
            risk_level = "HIGH"

        return {
            "total_claims": total,
            "entailed_claims": entailed_count,
            "neutral_claims": neutral_count,
            "contradicted_claims": contradicted_count,
            "grounding_score": grounding_score,
            "hallucination_rate": hallucination_rate,
            "risk_level": risk_level,
            "verified_claims": verified_claims
        }

    def verify_paper_summary(self, paper_id: str, summary_text: Optional[str] = None) -> Dict[str, Any]:
        """
        Verify a stored or newly generated paper summary against the paper's original abstract and text.
        """
        papers_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "papers")
        summaries_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "summaries")
        
        # Load paper source
        paper_file = os.path.join(papers_dir, f"{paper_id}.json")
        if not os.path.exists(paper_file):
            # Try finding without version suffix
            matches = [f for f in os.listdir(papers_dir) if f.startswith(paper_id)] if os.path.exists(papers_dir) else []
            if matches:
                paper_file = os.path.join(papers_dir, matches[0])
            else:
                raise FileNotFoundError(f"Paper '{paper_id}' not found in data/papers/")

        with open(paper_file, "r", encoding="utf-8") as f:
            paper_data = json.load(f)

        source_text = paper_data.get("abstract", "") or paper_data.get("summary", "")
        
        # Load summary text if not provided
        if not summary_text:
            summary_file = os.path.join(summaries_dir, f"{paper_id}.json")
            if not os.path.exists(summary_file):
                matches = [f for f in os.listdir(summaries_dir) if f.startswith(paper_id)] if os.path.exists(summaries_dir) else []
                if matches:
                    summary_file = os.path.join(summaries_dir, matches[0])
                else:
                    raise FileNotFoundError(f"Summary for paper '{paper_id}' not found in data/summaries/")

            with open(summary_file, "r", encoding="utf-8") as f:
                sum_data = json.load(f)
                summary_text = sum_data.get("summary", "")

        verification_result = self.verify_document(summary_text, source_text)
        verification_result["paper_id"] = paper_id
        verification_result["paper_title"] = paper_data.get("title", "")
        return verification_result


# Singleton instance
_verifier_instance = None

def get_citation_verifier() -> CitationVerifier:
    global _verifier_instance
    if _verifier_instance is None:
        _verifier_instance = CitationVerifier()
    return _verifier_instance
