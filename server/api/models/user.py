from pydantic import BaseModel


class User(BaseModel):
    logtoid: str
    email: str | None = None
    name: str | None = None
