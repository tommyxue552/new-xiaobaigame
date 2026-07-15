"""Unified API response format."""

from typing import Any, Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    """Standard API response envelope.

    All API endpoints MUST return this format:

    {
      "code": 0,
      "message": "success",
      "data": { ... }
    }
    """

    code: int = 0
    message: str = "success"
    data: T | None = None

    @classmethod
    def ok(cls, data: T = None, message: str = "success") -> "APIResponse[T]":
        return cls(code=0, message=message, data=data)

    @classmethod
    def error(cls, code: int, message: str, data: Any = None) -> "APIResponse":
        return cls(code=code, message=message, data=data)


class PaginatedData(BaseModel, Generic[T]):
    """Standard pagination wrapper."""

    items: list[T]
    total: int
    page: int
    page_size: int
    total_pages: int
