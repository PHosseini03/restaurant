"""Opening hours and reservation slot logic."""
from datetime import date, datetime, time, timedelta

SLOT_MINUTES = 30
LAST_SEATING_BEFORE_CLOSE = 90
MAX_DAYS_AHEAD = 90
MAX_COVERS_PER_SLOT = 40
SAME_DAY_LEAD_MINUTES = 30

# weekday(): Monday=0 ... Sunday=6. None = closed.
OPENING_HOURS: dict[int, tuple[time, time] | None] = {
    0: None,
    1: (time(17, 0), time(22, 0)),
    2: (time(17, 0), time(22, 0)),
    3: (time(17, 0), time(22, 0)),
    4: (time(17, 0), time(23, 0)),
    5: (time(17, 0), time(23, 0)),
    6: (time(12, 0), time(21, 0)),
}
DAY_NAMES = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"]


def slots_for(day: date) -> list[str]:
    hours = OPENING_HOURS[day.weekday()]
    if hours is None:
        return []
    opens, closes = hours
    current = timedelta(hours=opens.hour, minutes=opens.minute)
    last = timedelta(hours=closes.hour, minutes=closes.minute) - timedelta(minutes=LAST_SEATING_BEFORE_CLOSE)
    slots = []
    while current <= last:
        total = int(current.total_seconds() // 60)
        slots.append(f"{total // 60:02d}:{total % 60:02d}")
        current += timedelta(minutes=SLOT_MINUTES)
    return slots


def weekly_hours() -> list[dict]:
    result = []
    for idx, name in enumerate(DAY_NAMES):
        hours = OPENING_HOURS[idx]
        result.append({
            "day": name,
            "open": hours[0].strftime("%H:%M") if hours else None,
            "close": hours[1].strftime("%H:%M") if hours else None,
        })
    return result


def check_booking_date(day: date, today: date) -> None:
    if day < today:
        raise ValueError("muss heute oder später sein")
    if day > today + timedelta(days=MAX_DAYS_AHEAD):
        raise ValueError(f"muss innerhalb der nächsten {MAX_DAYS_AHEAD} Tage liegen")


def bookable_slots(day: date, now: datetime) -> list[str]:
    """Seating times for a day, excluding times already past (plus a lead time) today."""
    slots = slots_for(day)
    if day != now.date():
        return slots
    cutoff = (now + timedelta(minutes=SAME_DAY_LEAD_MINUTES)).strftime("%H:%M")
    return [s for s in slots if s > cutoff]
