import json
from pathlib import Path

from fastapi import APIRouter, HTTPException

from backend.models.user import (
    UserRegister,
    UserLogin
)

from backend.auth.password import (
    PasswordManager
)

from backend.auth.jwt_handler import (
    JWTHandler
)

router = APIRouter()

USER_DB = Path(
    "backend/database/users.json"
)


def load_users():

    if not USER_DB.exists():

        return []

    with open(
        USER_DB,
        "r",
        encoding="utf-8"
    ) as f:

        return json.load(f)


def save_users(users):
    USER_DB.parent.mkdir(parents=True, exist_ok=True)
    with open(
        USER_DB,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            users,
            f,
            indent=4
        )



@router.post("/register")
def register(
    user: UserRegister
):

    users = load_users()

    for existing in users:

        if (
            existing["username"]
            ==
            user.username
        ):

            raise HTTPException(
                status_code=400,
                detail="Username already exists."
            )

        if (
            existing["email"]
            ==
            user.email
        ):

            raise HTTPException(
                status_code=400,
                detail="Email already exists."
            )

    hashed = PasswordManager.hash_password(
        user.password
    )

    users.append(

        {

            "username":
            user.username,

            "email":
            user.email,

            "password":
            hashed

        }

    )

    save_users(users)

    return {

        "message":
        "Registration successful."

    }


@router.post("/login")
def login(
    user: UserLogin
):

    users = load_users()

    for existing in users:

        if (
            existing["username"]
            ==
            user.username
        ):

            valid = PasswordManager.verify_password(

                user.password,

                existing["password"]

            )

            if not valid:

                raise HTTPException(

                    status_code=401,

                    detail="Invalid password."

                )

            token = JWTHandler.create_access_token(

                user.username

            )

            return {

                "access_token":
                token,

                "token_type":
                "bearer"

            }

    raise HTTPException(

        status_code=404,

        detail="User not found."

    )


@router.get("/me")
def me(
    token: str
):

    username = JWTHandler.get_username(
        token
    )

    if username is None:

        raise HTTPException(

            status_code=401,

            detail="Invalid token."

        )

    users = load_users()

    for user in users:

        if (
            user["username"]
            ==
            username
        ):

            return {

                "username":
                user["username"],

                "email":
                user["email"]

            }

    raise HTTPException(

        status_code=404,

        detail="User not found."

    )