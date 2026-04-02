import os
from unittest.mock import patch

from app.core.config import DEFAULT_ALLOWED_ORIGINS, get_allowed_origins


def test_get_allowed_origins_returns_defaults_when_env_not_set() -> None:
    with patch.dict(os.environ, {}, clear=True):
        result = get_allowed_origins()
    assert result == DEFAULT_ALLOWED_ORIGINS


def test_get_allowed_origins_parses_comma_separated_env() -> None:
    with patch.dict(os.environ, {"ALLOWED_ORIGINS": "http://a.com,http://b.com"}):
        result = get_allowed_origins()
    assert result == ["http://a.com", "http://b.com"]


def test_get_allowed_origins_strips_whitespace() -> None:
    with patch.dict(os.environ, {"ALLOWED_ORIGINS": " http://a.com , http://b.com "}):
        result = get_allowed_origins()
    assert result == ["http://a.com", "http://b.com"]


def test_get_allowed_origins_ignores_empty_entries() -> None:
    with patch.dict(os.environ, {"ALLOWED_ORIGINS": "http://a.com,,, ,http://b.com"}):
        result = get_allowed_origins()
    assert result == ["http://a.com", "http://b.com"]
