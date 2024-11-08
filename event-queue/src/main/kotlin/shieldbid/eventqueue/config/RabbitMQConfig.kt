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
    fun testQueue(): Queue = Queue("queue.test", true)

    @Bean
    fun processingQueue(): Queue = Queue("queue.processing", true)

    @Bean
    fun testExchange(): TopicExchange = TopicExchange("exchange.test")

    @Bean
    fun processingExchange(): TopicExchange = TopicExchange("exchange.process")

    @Bean
    fun testQueueBinding(testQueue: Queue): Binding =
        BindingBuilder.bind(testQueue).to(testExchange()).with("test.*")

    @Bean
    fun processingQueueBinding(processingQueue: Queue): Binding =
        BindingBuilder.bind(processingQueue).to(processingExchange()).with("processing.*")

}