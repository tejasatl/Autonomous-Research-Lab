import arxiv


class PaperRetriever:
    def search(self, query: str, max_results: int = 10):

        search = arxiv.Search(
            query=query,
            max_results=max_results,
            sort_by=arxiv.SortCriterion.Relevance
        )

        client = arxiv.Client()

        papers = []

        for result in client.results(search):
            papers.append(
                {
                    "title": result.title,
                    "authors": [author.name for author in result.authors],
                    "summary": result.summary,
                    "published": str(result.published.date()),
                    "url": result.entry_id,
                }
            )

        return papers