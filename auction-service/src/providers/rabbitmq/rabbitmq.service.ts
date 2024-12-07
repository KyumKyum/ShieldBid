import { Injectable } from "@nestjs/common";
import { CacheService } from "../cache/cache.service";
import { AmqpConnection, RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { RoutingKey } from "src/constants/routingKey.constants";
import { CommonMsg } from "src/dto/commonMsg.dto";
import { AuctionRoute } from "src/constants/auctionRoute.constants";
import { CreateProductResponse } from "src/dto/product.dto";
import { CacheAuction } from "src/dto/auction.dto";
import { ProcessingRoute } from "src/constants/processingRoute.constants";
import { DatabaseRoute } from "src/constants/databaseRoute.constants copy";

@Injectable()
export class RabbitMQService {
    constructor(
		private readonly cacheService: CacheService,
		private readonly amqp: AmqpConnection,
	) {}

    private async createProductResponseHandler(event: CreateProductResponse) {
        const {productId, cacheKey} = event;

        const cachedAuction = await this.cacheService.flush<CacheAuction>(cacheKey);
		const createAuction = {
			productId,
			...cachedAuction,
		};

        const msg: CommonMsg = {
            route: DatabaseRoute.CREATE_AUCTION_REQUEST,
            payload: createAuction
        }

        await this.amqp.publish(
			process.env.RMQ_EXCHANGE_DB,
			RoutingKey.DATABASE,
			JSON.stringify(msg),
		);
    }

    @RabbitSubscribe({
        exchange: `${process.env.RMQ_EXCHANGE_AUCTION}`,
		routingKey: RoutingKey.AUCTION,
		queue: `${process.env.RMQ_QUEUE}`,
        errorHandler: (channel, msg, error) => {
            console.log(error)
        }
    })
    public async handler(msg: string){
        const { route, payload } = JSON.parse(msg) as CommonMsg;

        switch(route) {
            case AuctionRoute.CREATE_PRODUCT_RESPONSE: {
                const event: CreateProductResponse = payload as CreateProductResponse;

                await this.createProductResponseHandler(event);
                break;
            }
            case AuctionRoute.CREATE_AUCTION_RESPONSE: {
                const msg: CommonMsg = {
                    route: ProcessingRoute.DEPLOY_AUCTION_REQUEST,
                    payload
                }

                await this.amqp.publish(
                    process.env.RMQ_EXCHANGE_PROCESSING,
                    RoutingKey.PROCESSING,
                    JSON.stringify(msg)
                )
                break;
            }
            case AuctionRoute.START_AUCTION_RESPONSE: {
                console.log(`Auction Started: ${payload}`)
                break;
            }
            case AuctionRoute.TERMINATE_AUCTION_RESPONSE: {
                console.log(`Auctino Terminated: ${payload}`)
                break;
            }
        }
    }
}