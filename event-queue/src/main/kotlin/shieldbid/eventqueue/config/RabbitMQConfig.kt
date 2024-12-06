package shieldbid.eventqueue.config

import org.springframework.amqp.core.Binding
import org.springframework.amqp.core.BindingBuilder
import org.springframework.amqp.core.Queue
import org.springframework.amqp.core.DirectExchange
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration


@Configuration
class RabbitMQConfig {

    // Queue
    @Bean
    fun processingQueue(): Queue = Queue("queue.processing", true)

    @Bean
    fun databaseQueue(): Queue = Queue("queue.database", true)

    @Bean
    fun auctionQueue(): Queue = Queue("queue.auction", true)

    @Bean
    fun userQueue(): Queue = Queue("queue.user", true)


    // Exchange (changed to DirectExchange)
    @Bean
    fun processingExchange(): DirectExchange = DirectExchange("exchange.process")

    @Bean
    fun databaseExchange(): DirectExchange = DirectExchange("exchange.database")

    @Bean
    fun auctionExchange(): DirectExchange = DirectExchange("exchange.auction")

    @Bean
    fun userExchange(): DirectExchange = DirectExchange("exchange.user")


    // Binding (routing keys are exact matches)
    @Bean
    fun processingQueueBinding(processingQueue: Queue, processingExchange: DirectExchange): Binding =
        BindingBuilder.bind(processingQueue).to(processingExchange).with("processing")

    @Bean
    fun databaseQueueBinding(databaseQueue: Queue, databaseExchange: DirectExchange): Binding =
        BindingBuilder.bind(databaseQueue).to(databaseExchange).with("database")

    @Bean
    fun auctionQueueBinding(auctionQueue: Queue, auctionExchange: DirectExchange): Binding =
        BindingBuilder.bind(auctionQueue).to(auctionExchange).with("auction")

    @Bean
    fun userQueueBinding(userQueue: Queue, userExchange: DirectExchange): Binding =
        BindingBuilder.bind(userQueue).to(userExchange).with("user")
}