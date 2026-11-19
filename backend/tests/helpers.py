from datetime import date, timedelta


def next_weekday(weekday: int, min_days: int = 1) -> date:
    """Next date (at least min_days ahead) that falls on weekday (Mon=0)."""
    day = date.today() + timedelta(days=min_days)
    while day.weekday() != weekday:
        day += timedelta(days=1)
    return day


def reservation(**overrides) -> dict:
    payload = {
        "name": "Avery Stone",
        "email": "avery@example.com",
        "phone": "+1 503 555 0100",
        "date": next_weekday(4).isoformat(),
        "time": "19:00",
        "party_size": 4,
        "occasion": "anniversary",
        "notes": "Window table if possible.",
    }
    return {**payload, **overrides}


def event(**overrides) -> dict:
    payload = {
        "name": "Morgan Diaz",
        "email": "morgan@example.com",
        "phone": "503-555-0123",
        "event_date": (date.today() + timedelta(days=30)).isoformat(),
        "guests": 40,
        "event_type": "corporate",
        "message": "Team dinner with a set menu.",
    }
    return {**payload, **overrides}
