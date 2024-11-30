package shieldbid.eventqueue.config

import org.springframework.amqp.core.Binding
import org.springframework.amqp.core.BindingBuilder
import org.springframework.amqp.core.Queue
import org.springframework.amqp.core.TopicExchange
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


    // Exchange
    @Bean
    fun processingExchange(): TopicExchange = TopicExchange("exchange.process")

    @Bean
    fun databaseExchange(): TopicExchange = TopicExchange("exchange.database")

    @Bean
    fun auctionExchange(): TopicExchange = TopicExchange("exchange.auction")

    @Bean
    fun userExchange(): TopicExchange = TopicExchange("exchange.user")


    // Binding
    @Bean
    fun processingQueueBinding(processingQueue: Queue): Binding =
        BindingBuilder.bind(processingQueue).to(processingExchange()).with("processing.*")

    @Bean
    fun databaseQueueBinding(databaseQueue: Queue): Binding =
        BindingBuilder.bind(databaseQueue).to(databaseExchange()).with("database.*")

    @Bean
    fun auctionQueueBinding(auctionQueue: Queue): Binding =
        BindingBuilder.bind(auctionQueue).to(auctionExchange()).with("auction.*")

    @Bean
    fun userQueueBinding(userQueue: Queue): Binding =
        BindingBuilder.bind(userQueue).to(userExchange()).with("user.*")

}