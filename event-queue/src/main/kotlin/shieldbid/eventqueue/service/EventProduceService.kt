package shieldbid.eventqueue.service

import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class EventProduceService(
    @Autowired private val rabbit: RabbitTemplate
) {

    fun<E> produce(channel: String, event: E): Boolean {
        try {
            val stringifiedEvent = event.toString()
            rabbit.convertAndSend(channel, stringifiedEvent)
            return true;
        }catch (e: Exception){
            //* TODO: Error Handle
            println(e.printStackTrace())
            return false;
        }
    }
}