from fastapi import APIRouter

router = APIRouter()


@router.get("/authors")
def authors():

    return [
        {
            "name":"Yiran Chen",
            "papers":3
        },
        {
            "name":"Hai Li",
            "papers":2
        }
    ]