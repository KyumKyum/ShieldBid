import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";

@Injectable()
export class RabbitMQService {

    @RabbitSubscribe({
        exchange: `${process.env.RMQ_EXCHANGE}`,
        routingKey: "processing.test",
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
}