"""Request models with strict validation."""
from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator

from .hours import bookable_slots, check_booking_date, slots_for
from .validators import check_name, check_phone, clean_text

Category = Literal["starters", "wood-fire", "mains", "sides", "desserts", "drinks"]
Tag = Literal["vegetarian", "vegan", "gluten-free"]


class Strict(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


class Contact(Strict):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    phone: str = Field(min_length=7, max_length=20)

    @field_validator("name")
    @classmethod
    def _name(cls, v: str) -> str:
        return check_name(v)

    @field_validator("phone")
    @classmethod
    def _phone(cls, v: str) -> str:
        return check_phone(v)


class ReservationRequest(Contact):
    date: date
    time: str = Field(pattern=r"^\d{2}:\d{2}$")
    party_size: int = Field(ge=1, le=12)
    occasion: Literal["none", "birthday", "anniversary", "business", "date-night"] = "none"
    notes: str = Field(default="", max_length=500)

    @field_validator("notes")
    @classmethod
    def _notes(cls, v: str) -> str:
        return clean_text(v) if v else v

    @field_validator("date")
    @classmethod
    def _date(cls, v: date) -> date:
        check_booking_date(v, date.today())
        if not slots_for(v):
            raise ValueError("montags haben wir Ruhetag")
        return v

    @model_validator(mode="after")
    def _time_in_hours(self):
        if self.time not in bookable_slots(self.date, datetime.now()):
            raise ValueError("time: Bitte wählen Sie eine verfügbare Uhrzeit")
        return self


class EventRequest(Contact):
    event_date: date
    guests: int = Field(ge=10, le=120)
    event_type: Literal["birthday", "corporate", "wedding", "rehearsal", "other"]
    message: str = Field(default="", max_length=1000)

    @field_validator("message")
    @classmethod
    def _message(cls, v: str) -> str:
        return clean_text(v) if v else v

    @field_validator("event_date")
    @classmethod
    def _event_date(cls, v: date) -> date:
        if v <= date.today():
            raise ValueError("muss in der Zukunft liegen")
        return v
