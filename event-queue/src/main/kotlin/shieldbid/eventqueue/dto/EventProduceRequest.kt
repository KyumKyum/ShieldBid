package shieldbid.eventqueue.dto

import shieldbid.eventqueue.dto.events.Event

class EventProduceRequest (
    val topic: String,
    val event: Any
)