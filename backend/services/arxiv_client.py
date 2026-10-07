import arxiv

class ArxivClient:
    def __init__(self):
        self.client = arxiv.Client()

    def search(self, query: str, max_results: int = 10):
        try:
            search = arxiv.Search(
                query=query,
                max_results=max_results,
                sort_by=arxiv.SortCriterion.SubmittedDate
            )

            papers = []
            for result in self.client.results(search):
                short_id = result.get_short_id() if hasattr(result, "get_short_id") else result.entry_id.split("/")[-1]
                papers.append({
                    "id": short_id,
                    "title": result.title,
                    "authors": [a.name for a in result.authors],
                    "summary": result.summary,
                    "published": str(result.published.date() if hasattr(result.published, "date") else result.published),
                    "pdf": result.pdf_url
                })

            return papers
        except Exception as e:
            print(f"Error searching arXiv: {e}")
            return []

    def get_paper_by_id(self, paper_id: str):
        try:
            search = arxiv.Search(id_list=[paper_id])
            for result in self.client.results(search):
                short_id = result.get_short_id() if hasattr(result, "get_short_id") else result.entry_id.split("/")[-1]
                return {
                    "id": short_id,
                    "title": result.title,
                    "authors": [a.name for a in result.authors],
                    "summary": result.summary,
                    "published": str(result.published.date() if hasattr(result.published, "date") else result.published),
                    "pdf": result.pdf_url
                }
            return None
        except Exception as e:
            print(f"Error fetching paper {paper_id} from arXiv: {e}")
            return None