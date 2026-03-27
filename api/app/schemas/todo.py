from datetime import datetime

from pydantic import Field, model_validator

from app.schemas.common import APIModel


class TodoRead(APIModel):
    id: str
    description: str
    completed: bool
    created_at: datetime
    updated_at: datetime


class TodoCreate(APIModel):
    description: str

    @model_validator(mode="after")
    def validate_trimmed_description(self) -> "TodoCreate":
        description = self.description.strip()
        if not description or len(description) > 500:
            raise ValueError("Description must be between 1 and 500 characters.")
        self.description = description
        return self


class TodoUpdate(APIModel):
    description: str | None = None
    completed: bool | None = None

    @model_validator(mode="after")
    def validate_payload(self) -> "TodoUpdate":
        if self.description is None and self.completed is None:
            raise ValueError("At least one field must be provided.")
        if self.description is not None:
            description = self.description.strip()
            if not description or len(description) > 500:
                raise ValueError("Description must be between 1 and 500 characters.")
            self.description = description
        return self
