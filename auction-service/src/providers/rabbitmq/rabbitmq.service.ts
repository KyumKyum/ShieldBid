import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";

@Injectable()
export class RabbitMQService {
	@RabbitSubscribe({
		exchange: `${process.env.RMQ_EXCHANGE_AUCTION}`,
		routingKey: "auction.product.create.resp",
		queue: `${process.env.RMQ_QUEUE}`,
		// Acknowledge messages manually
		errorHandler: (channel, msg, error) => {
			console.error("Error processing message: ", JSON.stringify(msg));
			console.error(error);
			// Negative acknowledgment with requeueing in case of error
			channel.nack(msg, false, true);
		},
	})
	public async subHandler(cacheKey: string) {
		console.log(`Received message: ${cacheKey}`);
	}

	//* Add Subscriber in here
}
