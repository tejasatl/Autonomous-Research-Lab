from pydantic import BaseModel


class Paper(BaseModel):
    title: str
    authors: list[str]
    summary: str
    published: str
    url: str