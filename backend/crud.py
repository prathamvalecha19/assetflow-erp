def check_booking_overlap(db: Session, asset_id: int, start_time: datetime, end_time: datetime):
    return db.query(Booking).filter(
        Booking.asset_id == asset_id,
        Booking.start_time < end_time,
        Booking.end_time > start_time
    ).first() is not None