from backend.services.topic_recommender import (
    TopicRecommender
)

engine = TopicRecommender()

topic = "edge ai"

results = engine.recommend_by_topic(
    topic
)

print(
    f"\nRecommendations for: {topic}\n"
)

for result in results:

    print(
        f"{result['similarity']:.3f} | "
        f"{result['paper_id']} | "
        f"{result['title']}"
    )