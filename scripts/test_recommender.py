from backend.services.research_recommender import (
    ResearchRecommender
)

engine = ResearchRecommender()

results = engine.recommend_related_papers(
    "2502.15816v1"
)

print("\nRecommendations:\n")

for result in results:

    print(
        f"{result['similarity']:.3f} | "
        f"{result['paper_id']} | "
        f"{result['title']}"
    )