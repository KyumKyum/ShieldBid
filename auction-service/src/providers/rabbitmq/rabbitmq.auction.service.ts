import { AmqpConnection, RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Inject, Injectable } from "@nestjs/common";
import { AuctionRk } from "src/constants/auctionRk.constants";
import { CacheService } from "../cache/cache.service";
import { CacheAuction } from "src/dto/auction.dto";
import { CreateProductResponse } from "src/dto/product.dto";
import { DatabaseRk } from "src/constants/databaseRk.constants";
import { ProcessingRk } from "src/constants/processingRk.constants";

@Injectable()
export class RabbitAuctionMQService {
	constructor(
		private readonly cacheService: CacheService,
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
		//* Send processing server to create contract.
		await this.amqp.publish(
			process.env.RMQ_EXCHANGE_PROCESSING,
			ProcessingRk.AUCTION_CONTRACT_REQUEST,
			auctionId,
		);
	}

	@RabbitSubscribe({
		exchange: `${process.env.RMQ_EXCHANGE_AUCTION}`,
		routingKey: AuctionRk.AUCTION_TERMINATE_RESPONSE,
		queue: `${process.env.RMQ_QUEUE}`,
	})
	public async auctionTerminationResponseHandler(auctionId: string) {
		console.log(`TERMINATED: ${auctionId}`); //* TODO: proceed to add contract.
	}
}
