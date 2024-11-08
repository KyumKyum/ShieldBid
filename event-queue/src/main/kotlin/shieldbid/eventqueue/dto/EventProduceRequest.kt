package shieldbid.eventqueue.dto

class EventProduceRequest (
    val to: String,
    val rk: String,
    val event: Any
)