import { AmqpConnection, RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { AuctionRk } from "src/constants/auctionRk.constants";
import { DatabaseRk } from "src/constants/databaseRk.constants";
import { CreateAuctionEvent } from "src/dto/auctionEvent.dto";
import { SubscriberAuctionService } from "src/services/subscriber.auction.service";

@Injectable()
export class DatabaseAuctionMQService {
	constructor(
		private readonly subscriberAuctionService: SubscriberAuctionService,
		private readonly amqp: AmqpConnection,
	) {}

	@RabbitSubscribe({
		exchange: `${process.env.RMQ_EXCHANGE_DB}`,
		routingKey: DatabaseRk.AUCTION_CREATE,
		queue: `${process.env.RMQ_QUEUE}`,
		// Acknowledge messages manually
		errorHandler: (channel, msg, error) => {
			console.error("Error processing message: ", JSON.stringify(msg));
			console.error(error);
			// Negative acknowledgment with requeueing in case of error
			channel.nack(msg, false, true);
		},
	})
	public async createAuctionHandler(msg: string) {
		const {
			productId,
			auctionTitle,
			minimalPrice,
			ownerId,
		}: CreateAuctionEvent = JSON.parse(msg);

		const auctionId = await this.subscriberAuctionService.createNewAuction(
			productId,
			auctionTitle,
			minimalPrice,
		);

		const resp = {
			auctionId,
			ownerId,
		};

		if (auctionId) {
			this.amqp.publish(
				process.env.RMQ_EXCHANGE_AUCTION,
				AuctionRk.AUCTION_CREATE_RESPONSE,
				JSON.stringify(resp),
			);
		} else {
			this.amqp.publish(
				process.env.RMQ_EXCHANGE_AUCTION,
				AuctionRk.AUCTION_ERROR,
				"ERROR: Create Auction",
			);
		}
	}

	@RabbitSubscribe({
		exchange: `${process.env.RMQ_EXCHANGE_DB}`,
		routingKey: DatabaseRk.AUCTION_START,
		queue: `${process.env.RMQ_QUEUE}`,
	})
	public async startAuctionHandler(auctionId: string) {
		if (await this.subscriberAuctionService.startAuction(auctionId)) {
			this.amqp.publish(
				process.env.RMQ_EXCHANGE_AUCTION,
				AuctionRk.AUCTION_START_RESPONSE,
				auctionId,
			);
		} else {
			this.amqp.publish(
				process.env.RMQ_EXCHANGE_AUCTION,
				AuctionRk.AUCTION_ERROR,
				"ERROR: Terminate Auction",
			);
		}
	}

	@RabbitSubscribe({
		exchange: `${process.env.RMQ_EXCHANGE_DB}`,
		routingKey: DatabaseRk.AUCTION_TERMINATE,
		queue: `${process.env.RMQ_QUEUE}`,
	})
	public async terminateAuctionHandler(auctionId: string) {
		if (await this.subscriberAuctionService.terminateAuction(auctionId)) {
			this.amqp.publish(
				process.env.RMQ_EXCHANGE_AUCTION,
				AuctionRk.AUCTION_TERMINATE_RESPONSE,
				auctionId,
			);
		} else {
			this.amqp.publish(
				process.env.RMQ_EXCHANGE_AUCTION,
				AuctionRk.AUCTION_ERROR,
				"ERROR: Terminate Auction",
			);
		}
	}
}
