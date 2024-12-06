import { AmqpConnection, RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { AuctionRoute } from "src/constants/auctionRoute.constants";
import { DatabaseRoute } from "src/constants/databaseRoute.constants";
import { RoutingKey } from "src/constants/routingKey.constants";
import { CommonMsg } from "src/dto/commonMsg.dto";
import { CreateProductEvent } from "src/dto/productEvent.dto";
import { SubscriberProductService } from "src/services/subscriber.product.service";

@Injectable()
export class RabbitMQProductService {
	constructor(
		private readonly amqp: AmqpConnection,
		private readonly subscriberProductService: SubscriberProductService,
	) {}

	private async createProduct(event: CreateProductEvent) {
		const { cacheKey, ownerId, productName, productType }: CreateProductEvent =
			event;

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

			const msg: CommonMsg = {
				route: AuctionRoute.CREATE_PRODUCT_RESPONSE,
				payload: resp,
			};

			//* Return response event with cache key
			this.amqp.publish(
				process.env.RMQ_EXCHANGE_AUCTION,
				RoutingKey.AUCTION,
				JSON.stringify(msg),
			);
		} else {
			//* Return response event with Error
			this.amqp.publish(
				process.env.RMQ_EXCHANGE_AUCTION,
				RoutingKey.AUCTION,
				"ERROR: Create Product",
			);
		}
	}

	@RabbitSubscribe({
		exchange: `${process.env.RMQ_EXCHANGE_DB}`,
		routingKey: RoutingKey.DATABASE,
		queue: `${process.env.RMQ_QUEUE}`,
	})
	public async dbProductRequestHandler(msg: string): Promise<void> {
		const { route, payload } = JSON.parse(msg) as CommonMsg;

		switch (route) {
			case DatabaseRoute.PRODUCT_CREATE_REQUEST: {
				const event: CreateProductEvent = JSON.parse(
					payload,
				) as CreateProductEvent;
				await this.createProduct(event);
			}
		}
	}
}
