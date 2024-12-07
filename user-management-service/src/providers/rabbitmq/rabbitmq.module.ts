import { Module } from "@nestjs/common";
import { UserRabbitMQService } from "./rabbitmq.service";
import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { RoutingKey } from "src/constants/routingKey.constants";

@Module({
    imports: [
        RabbitMQModule.forRoot(RabbitMQModule, {
            exchanges: [
                {
                    name: `${process.env.RMQ_EXCHANGE_USER}`,
                    type: 'direct'
                }
            ],
            uri: `amqp://${process.env.RMQ_USER}:${process.env.RMQ_PWD}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`,
            connectionInitOptions: {wait: false},
            queues: [
				{
					name: `${process.env.RMQ_QUEUE}`,
                    exchange: `${process.env.RMQ_EXCHANGE_USER}`,
                    routingKey: RoutingKey.USER,
					options: {durable: true}
					
				},
			]
        })
    ],
    providers: [UserRabbitMQService],
    exports: [UserRabbitMQService,RabbitMQModule]
})

export class UserMgmtRabbitMQModule {};