package shieldbid.eventqueue.service

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class EventProduceService(
    @Autowired private val rabbit: RabbitTemplate
) {

    private val objMapper = jacksonObjectMapper()

    fun<E> produce(exchange: String, rk: String, event: E): Boolean {
        try {
            val stringifiedEvent = objMapper.writeValueAsString(event)
            rabbit.convertAndSend(exchange, rk, stringifiedEvent)
            return true;
        }catch (e: Exception){
            //* TODO: Error Handle
            println(e.printStackTrace())
            throw e;
        }
    }
}