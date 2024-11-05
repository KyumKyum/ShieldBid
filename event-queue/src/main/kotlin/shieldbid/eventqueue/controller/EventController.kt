package shieldbid.eventqueue.controller

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import shieldbid.eventqueue.dto.EventProduceRequest
import shieldbid.eventqueue.dto.EventResponse
import shieldbid.eventqueue.dto.events.EventEcho
import shieldbid.eventqueue.service.EventProduceService

@RestController
class EventController(
    @Autowired val eventProduceService: EventProduceService
) {

    @PostMapping("/event")
    fun handleProduceEvent(@RequestBody eventProduceRequest: EventProduceRequest): ResponseEntity<EventResponse> {
        try {
            val topic = eventProduceRequest.topic
//        when (val event= eventProduceRequest.event){
//            is EventEcho -> eventProduceService.produce(topic, event)
//            else -> {
//                println(event)
//                return ResponseEntity.badRequest().body(EventResponse(false, "Unsupported event!"))
//            }
//        }

            eventProduceService.produce(topic, eventProduceRequest.event)

            return ResponseEntity.ok(EventResponse(true, "OK!"))
        }catch (ex : Exception){
            return ResponseEntity.badRequest().body(EventResponse(false, ex.message ?: "Unknown error occurred"))
        }
    }
}