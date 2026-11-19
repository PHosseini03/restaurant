def test_health_returns_envelope(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json() == {"success": True, "data": {"status": "ok", "site": "Ember & Oak"}, "error": None}


def test_security_headers_present(client):
    res = client.get("/api/health")
    assert res.headers["x-content-type-options"] == "nosniff"
    assert res.headers["x-frame-options"] == "DENY"
    assert "default-src 'none'" in res.headers["content-security-policy"]


def test_docs_skip_strict_csp(client):
    assert "content-security-policy" not in client.get("/docs").headers


def test_cors_allows_only_configured_origin(client):
    allowed = client.get("/api/health", headers={"Origin": "http://localhost:5174"})
    blocked = client.get("/api/health", headers={"Origin": "https://evil.example"})
    assert allowed.headers.get("access-control-allow-origin") == "http://localhost:5174"
    assert "access-control-allow-origin" not in blocked.headers


def test_body_too_large_rejected(client):
    res = client.post("/api/reservations", content=b"x" * 20000, headers={"Content-Type": "application/json"})
    assert res.status_code == 413
    assert res.json()["success"] is False


def test_invalid_content_length_rejected(client):
    res = client.post("/api/reservations", content=b"{}", headers={"Content-Type": "application/json", "Content-Length": "abc"})
    assert res.status_code in (400, 422)


def test_unknown_route_uses_envelope(client):
    res = client.get("/api/nope")
    assert res.status_code == 404
    assert res.json()["success"] is False


def test_malformed_json_is_rejected(client):
    res = client.post("/api/reservations", content=b"{not json", headers={"Content-Type": "application/json"})
    assert res.status_code == 422
    assert res.json()["success"] is False


def test_validation_errors_are_german(client):
    res = client.post("/api/reservations", json={})
    assert res.status_code == 422
    assert "name: Pflichtfeld" in res.json()["error"]


def test_invalid_email_message_is_german(client):
    from tests.helpers import reservation

    res = client.post("/api/reservations", json={**reservation(), "email": "nope"})
    assert res.status_code == 422
    assert "gültige E-Mail-Adresse" in res.json()["error"]


def test_not_found_is_german(client):
    res = client.get("/api/does-not-exist")
    assert res.status_code == 404 and res.json()["error"] == "Nicht gefunden."
