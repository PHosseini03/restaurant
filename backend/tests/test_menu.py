from datetime import date, timedelta

from app.hours import slots_for, weekly_hours
from tests.helpers import next_weekday


def test_menu_lists_all_items_with_parsed_tags(client):
    data = client.get("/api/menu").json()["data"]
    assert len(data) == 17
    assert isinstance(data[0]["tags"], list)
    assert isinstance(data[0]["special"], bool)


def test_menu_filters_by_category(client):
    data = client.get("/api/menu", params={"category": "desserts"}).json()["data"]
    assert data and all(i["category"] == "desserts" for i in data)


def test_menu_filters_by_tag(client):
    data = client.get("/api/menu", params={"tag": "vegan"}).json()["data"]
    assert data and all("vegan" in i["tags"] for i in data)


def test_menu_combined_filters(client):
    data = client.get("/api/menu", params={"category": "wood-fire", "tag": "vegan"}).json()["data"]
    assert [i["name"] for i in data] == ["Blumenkohl aus dem Ofen"]


def test_menu_rejects_unknown_category(client):
    res = client.get("/api/menu", params={"category": "'; DROP TABLE menu_items; --"})
    assert res.status_code == 422
    assert client.get("/api/menu").json()["data"]


def test_specials(client):
    data = client.get("/api/specials").json()["data"]
    assert len(data) == 3 and all(i["special"] for i in data)


def test_hours(client):
    data = client.get("/api/hours").json()["data"]
    assert data["weekly"][0] == {"day": "Montag", "open": None, "close": None}
    assert data["weekly"][5]["close"] == "23:00"


def test_slots_logic():
    assert slots_for(next_weekday(0)) == []
    friday = slots_for(next_weekday(4))
    assert friday[0] == "17:00" and friday[-1] == "21:30"
    assert slots_for(next_weekday(6))[0] == "12:00"
    assert len(weekly_hours()) == 7


def test_availability_open_day(client):
    day = next_weekday(2).isoformat()
    data = client.get("/api/availability", params={"date": day}).json()["data"]
    assert data["closed"] is False
    assert data["slots"][0] == {"time": "17:00", "available": True}


def test_availability_closed_monday(client):
    data = client.get("/api/availability", params={"date": next_weekday(0).isoformat()}).json()["data"]
    assert data == {"date": next_weekday(0).isoformat(), "closed": True, "slots": []}


def test_availability_rejects_past_and_far_dates(client):
    past = (date.today() - timedelta(days=1)).isoformat()
    far = (date.today() + timedelta(days=200)).isoformat()
    assert client.get("/api/availability", params={"date": past}).status_code == 422
    res = client.get("/api/availability", params={"date": far})
    assert res.status_code == 422 and "90 Tage" in res.json()["error"]


def test_availability_rejects_bad_date(client):
    assert client.get("/api/availability", params={"date": "tomorrow"}).status_code == 422
