from datetime import date, timedelta

from tests.helpers import event, next_weekday, reservation


def test_create_reservation(client):
    res = client.post("/api/reservations", json=reservation())
    assert res.status_code == 201
    data = res.json()["data"]
    assert data["id"] == 1 and data["party_size"] == 4
    assert "Avery" in data["message"]


def test_reservation_marks_slot_full(client):
    day = next_weekday(3).isoformat()
    for _ in range(3):
        assert client.post("/api/reservations", json=reservation(date=day, party_size=12)).status_code == 201
    full = client.post("/api/reservations", json=reservation(date=day, party_size=12))
    assert full.status_code == 409
    assert "ausgebucht" in full.json()["error"]
    slots = client.get("/api/availability", params={"date": day}).json()["data"]["slots"]
    assert {"time": "19:00", "available": True} in slots


def test_reservation_rejects_past_date(client):
    past = (date.today() - timedelta(days=2)).isoformat()
    res = client.post("/api/reservations", json=reservation(date=past))
    assert res.status_code == 422 and "date" in res.json()["error"]


def test_reservation_rejects_monday(client):
    res = client.post("/api/reservations", json=reservation(date=next_weekday(0).isoformat()))
    assert res.status_code == 422 and "montags" in res.json()["error"]


def test_reservation_rejects_time_outside_hours(client):
    res = client.post("/api/reservations", json=reservation(time="09:00"))
    assert res.status_code == 422 and "verfügbare Uhrzeit" in res.json()["error"]


def test_reservation_rejects_party_size(client):
    assert client.post("/api/reservations", json=reservation(party_size=0)).status_code == 422
    assert client.post("/api/reservations", json=reservation(party_size=13)).status_code == 422


def test_reservation_rejects_bad_contact(client):
    assert client.post("/api/reservations", json=reservation(email="nope")).status_code == 422
    assert client.post("/api/reservations", json=reservation(phone="call me")).status_code == 422
    assert client.post("/api/reservations", json=reservation(name="<script>alert(1)</script>")).status_code == 422
    assert client.post("/api/reservations", json=reservation(notes="<img src=x onerror=alert(1)>")).status_code == 422


def test_reservation_rejects_unknown_fields(client):
    assert client.post("/api/reservations", json=reservation(is_vip=True)).status_code == 422


def test_sql_injection_stored_as_text(client):
    assert client.post("/api/reservations", json=reservation(notes="'); DROP TABLE reservations; --")).status_code == 201
    assert client.post("/api/reservations", json=reservation()).json()["data"]["id"] == 2


def test_rate_limit_on_reservations(client):
    codes = [client.post("/api/reservations", json=reservation(party_size=1)).status_code for _ in range(12)]
    assert 429 in codes
    last = client.post("/api/reservations", json=reservation(party_size=1)).json()
    assert last["success"] is False and "Zu viele" in last["error"]


def test_create_event_inquiry(client):
    res = client.post("/api/events", json=event())
    assert res.status_code == 201
    assert "Morgan" in res.json()["data"]["message"]


def test_event_validation(client):
    assert client.post("/api/events", json=event(guests=5)).status_code == 422
    assert client.post("/api/events", json=event(event_type="rave")).status_code == 422
    assert client.post("/api/events", json=event(event_date=date.today().isoformat())).status_code == 422
    assert client.post("/api/events", json=event(message="<b>hi</b>")).status_code == 422
