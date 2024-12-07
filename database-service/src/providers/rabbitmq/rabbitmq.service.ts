import { AmqpConnection, RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { AuctionRoute } from "src/constants/auctionRoute.constants";
import { DatabaseRoute } from "src/constants/databaseRoute.constants";
import { RoutingKey } from "src/constants/routingKey.constants";
import { CreateAuctionEvent } from "src/dto/auctionEvent.dto";
import { CommonMsg } from "src/dto/commonMsg.dto";
import { LoginAddrEvent } from "src/dto/userEvent.dto";
import { SubscriberAuctionService } from "src/services/subscriber.auction.service";
import { CacheService } from "../cache/cache.service";
import { SubscriberUserService } from "src/services/subscriber.user.service";
import { CreateProductEvent } from "src/dto/productEvent.dto";
import { SubscriberProductService } from "src/services/subscriber.product.service";

@Injectable()
export class RabbitMQService {
	constructor(
		private readonly amqp: AmqpConnection,
		private readonly auctionService: SubscriberAuctionService,
		private readonly cacheService: CacheService,
		private readonly subscriberAuctionService: SubscriberAuctionService,
		private readonly subscriberProductService: SubscriberProductService,
		private readonly subscriberUserService: SubscriberUserService
	) {}

	@RabbitSubscribe({
		exchange: `${process.env.RMQ_EXCHANGE_DB}`,
		routingKey: RoutingKey.DATABASE,
		queue: `${process.env.RMQ_QUEUE}`,
	})
	public async handler(msg: string): Promise<void> {

		const { route, payload } = JSON.parse(msg) as CommonMsg;
		switch (route) {
			case DatabaseRoute.CREATE_AUCTION_REQUEST: {
				const event: CreateAuctionEvent = payload as CreateAuctionEvent
				await this.createAuctionEvent(event);
				break;
			}
			case DatabaseRoute.START_AUCTION_REQUEST: {
				console.log(payload)
				await this.startAuction(payload);
				break;
			}
			case DatabaseRoute.TERMINATE_AUCTION_REQUEST: {
				await this.terminateAuction(payload);
				break;
			}
			case DatabaseRoute.LOGIN_WITH_ADDR: {
				const event: LoginAddrEvent = JSON.parse(payload) as LoginAddrEvent;
				await this.loginAddr(event);
				break;
			}
			case DatabaseRoute.PRODUCT_CREATE_REQUEST: {
				const event: CreateProductEvent = payload as CreateProductEvent
				await this.createProduct(event);
				break;
			}
			case DatabaseRoute.GET_ALL_AUCTIONS: {
				const auctions = await this.subscriberAuctionService.queryAllAuctions();
				await this.cacheService.set(payload, JSON.stringify(auctions))
			}
			case DatabaseRoute.GET_SINGLE_AUCTION: {
				const {cid, auctionId} = payload;
				const auction = await this.subscriberAuctionService.queryAuction(auctionId);
				await this.cacheService.set(cid, JSON.stringify(auction));
			}
		}
	}

	private async createProduct(event: CreateProductEvent) {
		const { cacheKey, ownerId, productName, productType, productDescription }: CreateProductEvent =
			event;

		const productId = await this.subscriberProductService.createNewProduct(
			ownerId,
			productName,
			productType,
			productDescription
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
			await this.amqp.publish(
				process.env.RMQ_EXCHANGE_AUCTION,
				RoutingKey.AUCTION,
				JSON.stringify(msg),
			);
		} else {
			//* Return response event with Error
			await this.amqp.publish(
				process.env.RMQ_EXCHANGE_AUCTION,
				RoutingKey.AUCTION,
				"ERROR: Create Product",
			);
		}
	}
	
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

	private async loginAddr(event: LoginAddrEvent) {
		const {cid, addr} = event
		//* NOTICE: This is a demo. Login will also generate a new user.
		//* Comment following line after end for the demo.
		console.log(cid, addr);
		await this.subscriberUserService.createDemoUser(addr);

		const user = await this.subscriberUserService.getUserByAddress(addr);
		console.log(addr);
		await this.cacheService.set(cid, JSON.stringify(user))
	}

}
