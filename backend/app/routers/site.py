"""Restaurant-specific endpoints."""
import json
import threading
from datetime import date, datetime

from fastapi import APIRouter, HTTPException, Query, Request

from ..config import settings
from ..db import fetch_all, insert
from ..hours import MAX_COVERS_PER_SLOT, bookable_slots, check_booking_date, slots_for, weekly_hours
from ..responses import ok
from ..schemas import Category, EventRequest, ReservationRequest, Tag
from ..security import limiter

router = APIRouter()
# Serializes the capacity check + insert so concurrent requests cannot overbook a slot.
_booking_lock = threading.Lock()


def _menu_row(row: dict) -> dict:
    return {**row, "tags": json.loads(row["tags"]), "special": bool(row["special"])}


def _booked_covers(day: date) -> dict[str, int]:
    rows = fetch_all(
        "SELECT time, SUM(party_size) AS covers FROM reservations WHERE date = ? GROUP BY time",
        (day.isoformat(),),
    )
    return {r["time"]: int(r["covers"]) for r in rows}


@router.get("/menu")
def list_menu(category: Category | None = None, tag: Tag | None = None):
    if category:
        rows = fetch_all("SELECT * FROM menu_items WHERE category = ? ORDER BY id", (category,))
    else:
        rows = fetch_all("SELECT * FROM menu_items ORDER BY id")
    items = [_menu_row(r) for r in rows]
    if tag:
        items = [i for i in items if tag in i["tags"]]
    return ok(items)


@router.get("/specials")
def list_specials():
    rows = fetch_all("SELECT * FROM menu_items WHERE special = 1 ORDER BY id")
    return ok([_menu_row(r) for r in rows])


@router.get("/hours")
def hours():
    return ok({"weekly": weekly_hours(), "address": "Ihre Adresse hier", "phone": "Ihre Telefonnummer hier"})


@router.get("/availability")
def availability(day: date = Query(alias="date")):
    try:
        check_booking_date(day, date.today())
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=f"date: {exc}") from exc
    booked = _booked_covers(day)
    slots = [
        {"time": t, "available": MAX_COVERS_PER_SLOT - booked.get(t, 0) > 0}
        for t in bookable_slots(day, datetime.now())
    ]
    closed = not slots_for(day)
    return ok({"date": day.isoformat(), "closed": closed, "slots": slots})


@router.post("/reservations", status_code=201)
@limiter.limit(settings.rate_limit)
def create_reservation(request: Request, body: ReservationRequest):
    with _booking_lock:
        booked = _booked_covers(body.date).get(body.time, 0)
        if booked + body.party_size > MAX_COVERS_PER_SLOT:
            raise HTTPException(status_code=409, detail="Diese Uhrzeit ist leider ausgebucht. Bitte wählen Sie eine andere Zeit.")
        reservation_id = insert(
            "INSERT INTO reservations (name, email, phone, date, time, party_size, occasion, notes)"
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (body.name, str(body.email), body.phone, body.date.isoformat(), body.time,
             body.party_size, body.occasion, body.notes),
        )
    first = body.name.split()[0]
    return ok({
        "id": reservation_id,
        "message": f"Bis bald, {first}! Ihr Tisch für {body.party_size} {'Person' if body.party_size == 1 else 'Personen'} ist bestätigt.",
        "date": body.date.isoformat(),
        "time": body.time,
        "party_size": body.party_size,
    })


@router.post("/events", status_code=201)
@limiter.limit(settings.rate_limit)
def create_event_inquiry(request: Request, body: EventRequest):
    inquiry_id = insert(
        "INSERT INTO event_inquiries (name, email, phone, event_date, guests, event_type, message)"
        " VALUES (?, ?, ?, ?, ?, ?, ?)",
        (body.name, str(body.email), body.phone, body.event_date.isoformat(), body.guests,
         body.event_type, body.message),
    )
    first = body.name.split()[0]
    return ok({"id": inquiry_id, "message": f"Vielen Dank, {first}! Unser Event-Team meldet sich innerhalb eines Werktags bei Ihnen."})
