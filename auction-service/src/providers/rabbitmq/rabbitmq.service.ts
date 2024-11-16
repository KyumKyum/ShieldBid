import { AmqpConnection, RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Inject, Injectable } from "@nestjs/common";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";
import { AuctionRk } from "src/constants/auctionRk.constants";
import { CacheService } from "../cache/cache.service";
import type { CacheAuction } from "src/dto/auction.dto";
import type { CreateProductResponse } from "src/dto/product.dto";
import { DatabaseRk } from "src/constants/databaseRk.constants";

@Injectable()
export class RabbitMQService {
	constructor(
		@Inject(CacheService) private readonly cacheService: CacheService,
		private readonly amqp: AmqpConnection,
	) {}

	//* Product Create Response
	@RabbitSubscribe({
		exchange: `${process.env.RMQ_EXCHANGE_AUCTION}`,
		routingKey: AuctionRk.PRODUCT_CREATE_RESPONSE,
		queue: `${process.env.RMQ_QUEUE}`,
		// Acknowledge messages manually
		errorHandler: (channel, msg, error) => {
			console.error("Error processing message: ", JSON.stringify(msg));
			console.error(error);
			// Negative acknowledgment with requeueing in case of error
			channel.nack(msg, false, true);
		},
	})
	public async productCreateResponseHandler(createProductResponse: string) {
		const { productId, cacheKey }: CreateProductResponse = JSON.parse(
			createProductResponse,
		);

		const cachedAuction = await this.cacheService.flush<CacheAuction>(cacheKey);
		const createAuction = {
			productId,
			...cachedAuction,
		};

		console.log(JSON.stringify(createAuction));

		await this.amqp.publish(
			process.env.RMQ_EXCHANGE_DB,
			DatabaseRk.AUCTION_CREATE,
			JSON.stringify(createAuction),
		);
	}

	@RabbitSubscribe({
		exchange: `${process.env.RMQ_EXCHANGE_AUCTION}`,
		routingKey: AuctionRk.AUCTION_CREATE_RESPONSE,
		queue: `${process.env.RMQ_QUEUE}`,
	})
	public async productAuctionResponseHandler(auctionId: string) {
		console.log(auctionId); //* TODO: proceed to add contract.
	}
}
