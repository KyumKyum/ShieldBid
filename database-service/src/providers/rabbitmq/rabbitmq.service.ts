import { AmqpConnection, RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";
import { CreateProductEvent } from "src/dto/createProductEvent.dto";
import { SubscriberProductService } from "src/services/subscriber.product.service";

@Injectable()
export class DatabaseMQService {
	constructor(
		private readonly subscriberProductService: SubscriberProductService,
		private readonly amqp: AmqpConnection,
	) {}

	@RabbitSubscribe({
		exchange: `${process.env.RMQ_EXCHANGE_DB}`,
		routingKey: "database.product.create",
		queue: `${process.env.RMQ_QUEUE}`,
		// Acknowledge messages manually
		errorHandler: (channel, msg, error) => {
			console.error("Error processing message: ", JSON.stringify(msg));
			console.error(error);
			// Negative acknowledgment with requeueing in case of error
			channel.nack(msg, false, true);
		},
	})
	public async createProductHandler(msg: string) {
		const { cacheKey, ownerId, productName, productType }: CreateProductEvent =
			JSON.parse(msg);

		if (
			await this.subscriberProductService.createNewProduct(
				ownerId,
				productName,
				productType,
			)
		) {
			//* Return response event with cache key
			this.amqp.publish(
				process.env.RMQ_EXCHANGE_AUCTION,
				"auction.product.create.resp",
				cacheKey,
			);
		} else {
			//* Return response event with Error
			this.amqp.publish(
				process.env.RMQ_EXCHANGE_AUCTION,
				"auction.product.create.error",
				"ERROR",
			);
		}
	}

	//* Add Subscriber in here
}
