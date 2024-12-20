import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";
import { RoutingKey } from "src/constants/routingKey.constants";

@Injectable()
export class UserRabbitMQService {

    @RabbitSubscribe({
        exchange: `${process.env.RMQ_EXCHANGE_USER}`,
        routingKey: RoutingKey.USER,
        queue: `${process.env.RMQ_QUEUE}`,
         // Acknowledge messages manually
        errorHandler: (channel, msg, error) => {
            console.error('Error processing message: ', JSON.stringify(msg));
            console.error(error);
            // Negative acknowledgment with requeueing in case of error
            channel.nack(msg, false, true);
        }
    })
    public async subHandler(msg: {}) {
        console.log(`Received message: ${JSON.stringify(msg)}`);
    }

    //* Add Subscriber in here
}