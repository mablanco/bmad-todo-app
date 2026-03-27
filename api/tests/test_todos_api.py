from fastapi.testclient import TestClient


def test_list_todos_returns_newest_first(client: TestClient) -> None:
    first = client.post("/api/v1/todos", json={"description": "First task"}).json()["data"]
    second = client.post("/api/v1/todos", json={"description": "Second task"}).json()["data"]

    response = client.get("/api/v1/todos")

    assert response.status_code == 200
    items = response.json()["data"]
    assert len(items) == 2
    assert items[0]["id"] == second["id"]
    assert items[1]["id"] == first["id"]


def test_list_todos_returns_empty_collection(client: TestClient) -> None:
    response = client.get("/api/v1/todos")

    assert response.status_code == 200
    assert response.json() == {"data": []}


def test_create_todo_returns_created_resource(client: TestClient) -> None:
    response = client.post("/api/v1/todos", json={"description": "Write integration tests"})

    assert response.status_code == 201
    payload = response.json()["data"]
    assert payload["description"] == "Write integration tests"
    assert payload["completed"] is False
    assert payload["id"]
    assert payload["created_at"]
    assert payload["updated_at"]


def test_create_todo_rejects_blank_description(client: TestClient) -> None:
    response = client.post("/api/v1/todos", json={"description": "   "})

    assert response.status_code == 422
    assert response.json()["error"]["code"] == "VALIDATION_ERROR"


def test_update_todo_can_toggle_completion(client: TestClient) -> None:
    created = client.post("/api/v1/todos", json={"description": "Ship backend CRUD"}).json()["data"]

    response = client.patch(f"/api/v1/todos/{created['id']}", json={"completed": True})

    assert response.status_code == 200
    payload = response.json()["data"]
    assert payload["id"] == created["id"]
    assert payload["completed"] is True
    assert payload["description"] == "Ship backend CRUD"


def test_update_todo_returns_not_found_for_missing_id(client: TestClient) -> None:
    response = client.patch("/api/v1/todos/missing-id", json={"completed": True})

    assert response.status_code == 404
    assert response.json() == {
        "error": {
            "code": "TODO_NOT_FOUND",
            "message": "Todo not found.",
            "details": {},
        }
    }


def test_delete_todo_removes_resource(client: TestClient) -> None:
    created = client.post("/api/v1/todos", json={"description": "Remove me"}).json()["data"]

    delete_response = client.delete(f"/api/v1/todos/{created['id']}")
    list_response = client.get("/api/v1/todos")

    assert delete_response.status_code == 204
    assert list_response.json() == {"data": []}


def test_delete_todo_returns_not_found_for_missing_id(client: TestClient) -> None:
    response = client.delete("/api/v1/todos/missing-id")

    assert response.status_code == 404
    assert response.json() == {
        "error": {
            "code": "TODO_NOT_FOUND",
            "message": "Todo not found.",
            "details": {},
        }
    }
