package shieldbid.eventqueue.config

import org.springframework.amqp.core.Binding
import org.springframework.amqp.core.BindingBuilder
import org.springframework.amqp.core.Queue
import org.springframework.amqp.core.TopicExchange
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class RabbitMQConfig {

    @Bean
    fun testQueue(): Queue = Queue("testQueue", true)

    //* Add More Queue

    @Bean
    fun exchange(): TopicExchange = TopicExchange("TopicExchange")

    @Bean
    fun binding(queue: Queue, exchange: TopicExchange): Binding =
        BindingBuilder.bind(queue).to(exchange).with("routing.key.#")
}