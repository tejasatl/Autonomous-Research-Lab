import json
from pathlib import Path

from sentence_transformers import (
    SentenceTransformer
)

from sklearn.metrics.pairwise import (
    cosine_similarity
)


class TopicRecommender:

    def __init__(self):

        self.model = SentenceTransformer(
            "all-MiniLM-L6-v2"
        )

        self.papers = []

        paper_dir = Path(
            "data/papers"
        )

        for file in paper_dir.glob(
            "*.json"
        ):

            with open(
                file,
                "r",
                encoding="utf-8"
            ) as f:

                paper = json.load(f)

            self.papers.append(
                {
                    "id": file.stem,
                    "title": paper["title"],
                    "summary": paper["summary"]
                }
            )

        self.paper_texts = [

            paper["title"] +
            " " +
            paper["summary"]

            for paper in self.papers
        ]

        self.paper_embeddings = (
            self.model.encode(
                self.paper_texts,
                show_progress_bar=False
            )
        )

    def recommend_by_topic(
        self,
        topic: str,
        top_k: int = 5
    ):

        topic_embedding = self.model.encode(
            [topic]
        )

        similarities = cosine_similarity(
            topic_embedding,
            self.paper_embeddings
        )[0]

        results = []

        for idx, score in enumerate(
            similarities
        ):

            results.append(
                {
                    "paper_id":
                    self.papers[idx]["id"],

                    "title":
                    self.papers[idx]["title"],

                    "similarity":
                    round(
                        float(score),
                        3
                    )
                }
            )

        results.sort(
            key=lambda x: x["similarity"],
            reverse=True
        )

        return results[:top_k]