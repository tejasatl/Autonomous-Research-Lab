from datetime import datetime, timedelta

from jose import jwt
from jose import JWTError

# ==========================
# Change this in production
# ==========================

SECRET_KEY = "AUTONOMOUS_RESEARCH_LAB_SECRET_KEY"

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60


class JWTHandler:

    @staticmethod
    def create_access_token(username: str):

        expire = (
            datetime.utcnow()
            +
            timedelta(
                minutes=ACCESS_TOKEN_EXPIRE_MINUTES
            )
        )

        payload = {

            "sub": username,

            "exp": expire

        }

        token = jwt.encode(

            payload,

            SECRET_KEY,

            algorithm=ALGORITHM

        )

        return token

    @staticmethod
    def verify_token(token: str):

        try:

            payload = jwt.decode(

                token,

                SECRET_KEY,

                algorithms=[ALGORITHM]

            )

            return payload

        except JWTError:

            return None

    @staticmethod
    def get_username(token: str):

        payload = JWTHandler.verify_token(token)

        if payload:

            return payload.get("sub")

        return None