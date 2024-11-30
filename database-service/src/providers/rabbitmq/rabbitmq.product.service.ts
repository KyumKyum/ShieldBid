import { AmqpConnection, RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { AuctionRk } from "src/constants/auctionRk.constants";
import { DatabaseRk } from "src/constants/databaseRk.constants";
import { CreateProductEvent } from "src/dto/productEvent.dto";
import { SubscriberProductService } from "src/services/subscriber.product.service";

@Injectable()
export class DatabaseProductMQService {
	constructor(
		private readonly subscriberProductService: SubscriberProductService,
		private readonly amqp: AmqpConnection,
	) {}

	@RabbitSubscribe({
		exchange: `${process.env.RMQ_EXCHANGE_DB}`,
		routingKey: DatabaseRk.PRODUCT_CREATE,
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

		const productId = await this.subscriberProductService.createNewProduct(
			ownerId,
			productName,
			productType,
		);

		if (productId) {
			const resp = {
				productId,
				cacheKey,
			};

			//* Return response event with cache key
			this.amqp.publish(
				process.env.RMQ_EXCHANGE_AUCTION,
				AuctionRk.PRODUCT_CREATE_RESPONSE,
				JSON.stringify(resp),
			);
		} else {
			//* Return response event with Error
			this.amqp.publish(
				process.env.RMQ_EXCHANGE_AUCTION,
				AuctionRk.AUCTION_ERROR,
				"ERROR: Create Product",
			);
		}
	}
}
