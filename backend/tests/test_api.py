

def test_same_day_past_slots_are_not_bookable():
    from datetime import datetime

    from app.hours import bookable_slots

    friday = datetime(2026, 11, 20, 19, 10)
    slots = bookable_slots(friday.date(), friday)
    assert "19:00" not in slots and "19:30" not in slots
    assert slots[0] == "20:00"
    later_day = datetime(2026, 11, 21, 19, 10).date()
    assert "17:00" in bookable_slots(later_day, friday)
