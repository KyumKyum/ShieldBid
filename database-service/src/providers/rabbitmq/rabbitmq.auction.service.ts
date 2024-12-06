import { AmqpConnection, RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { AuctionRoute } from "src/constants/auctionRoute.constants";
import { DatabaseRoute } from "src/constants/databaseRoute.constants";
import { RoutingKey } from "src/constants/routingKey.constants";
import { CreateAuctionEvent } from "src/dto/auctionEvent.dto";
import { CommonMsg } from "src/dto/commonMsg.dto";
import { SubscriberAuctionService } from "src/services/subscriber.auction.service";

@Injectable()
export class RabbitMQAuctionService {
	constructor(
		private readonly amqp: AmqpConnection,
		private readonly auctionService: SubscriberAuctionService,
	) {}

	private async createAuctionEvent(event: CreateAuctionEvent) {
		const resp = await this.auctionService.createNewAuction(event);

		if (resp) {
			const msg: CommonMsg = {
				route: AuctionRoute.CREATE_AUCTION_RESPONSE,
				payload: resp,
			};
			await this.amqp.publish(
				process.env.RMQ_EXCHANGE_AUCTION,
				RoutingKey.AUCTION,
				JSON.stringify(msg),
			);
		} else {
			await this.amqp.publish(
				process.env.RMQ_EXCHANGE_AUCTION,
				RoutingKey.AUCTION,
				"ERROR: Create Auction Event",
			);
		}
	}

	private async startAuction(auctionId: string) {
		const msg: CommonMsg = {
			route: AuctionRoute.START_AUCTION_RESPONSE,
			payload: auctionId
		}

		if (await this.auctionService.startAuction(auctionId)) {
			await this.amqp.publish(
				process.env.RMQ_EXCHANGE_AUCTION,
				RoutingKey.AUCTION,
				JSON.stringify(msg),
			);
		} else {
			await this.amqp.publish(
				process.env.RMQ_EXCHANGE_AUCTION,
				RoutingKey.AUCTION,
				"ERROR: Start Auction Event",
			);
		}
	}

	private async terminateAuction(auctionId: string) {
		const msg: CommonMsg = {
			route: AuctionRoute.TERMINATE_AUCTION_RESPONSE,
			payload: auctionId
		}

		if (await this.auctionService.terminateAuction(auctionId)) {
			await this.amqp.publish(
				process.env.RMQ_EXCHANGE_AUCTION,
				RoutingKey.AUCTION,
				JSON.stringify(msg),
			);
		} else {
			await this.amqp.publish(
				process.env.RMQ_EXCHANGE_AUCTION,
				RoutingKey.AUCTION,
				"ERROR: Terminate Auction Event",
			);
		}
	}

	@RabbitSubscribe({
		exchange: `${process.env.RMQ_EXCHANGE_DB}`,
		routingKey: RoutingKey.DATABASE,
		queue: `${process.env.RMQ_QUEUE}`,
	})
	public async dbAuctionRequestHandler(msg: string): Promise<void> {
		const { route, payload } = JSON.parse(msg) as CommonMsg;

		switch (route) {
			case DatabaseRoute.CREATE_AUCTION_REQUEST: {
				const event: CreateAuctionEvent = JSON.parse(
					payload,
				) as CreateAuctionEvent;
				await this.createAuctionEvent(event);
				break;
			}
			case DatabaseRoute.START_AUCTION_REQUEST: {
				await this.startAuction(payload);
				break;
			}
			case DatabaseRoute.TERMINATE_AUCTION_REQUEST: {
				await this.terminateAuction(payload);
				break;
			}
		}
	}
}
