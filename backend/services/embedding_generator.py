from sentence_transformers import (
    SentenceTransformer
)


class EmbeddingGenerator:

    def __init__(self):

        self.model = SentenceTransformer(

            "BAAI/bge-small-en-v1.5"

        )

    def generate(

        self,

        text

    ):

        return self.model.encode(

            text

        ).tolist()