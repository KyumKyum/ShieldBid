package shieldbid.eventqueue

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class EventQueueApplication

fun main(args: Array<String>) {
	//* Bootstrap
	runApplication<EventQueueApplication>(*args)
}
