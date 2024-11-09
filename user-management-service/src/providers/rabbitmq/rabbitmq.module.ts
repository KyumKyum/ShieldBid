import { Module } from "@nestjs/common";
import { RabbitMQService } from "./rabbitmq.service";
import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";

@Module({
    imports: [
        RabbitMQModule.forRoot(RabbitMQModule, {
            exchanges: [
                {
                    name: `${process.env.RMQ_EXCHANGE}`,
                    type: 'topic'
                }
            ],
            uri: `amqp://${process.env.RMQ_USER}:${process.env.RMQ_PWD}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`,
            connectionInitOptions: {wait: false}
        })
    ],
    providers: [RabbitMQService]
})

export class UserMgmtRabbitMQModule {};