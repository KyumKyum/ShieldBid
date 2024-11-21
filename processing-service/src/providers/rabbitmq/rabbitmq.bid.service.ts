import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { ProcessingRk } from "src/constants/processingRk.constants";
import { OfferBidRequest } from "src/dto/OfferBidRequest.dto";

@Injectable()
export class RabbitBidMQService {
	@RabbitSubscribe({
		exchange: `${process.env.RMQ_EXCHANGE_PROCESSING}`,
		routingKey: ProcessingRk.OFFER_BID_REQUEST,
		queue: `${process.env.RMQ_QUEUE}`,
	})
	public async offerBidRequestHandler(offerBidRequest: string) {
		const { auctionId, price }: OfferBidRequest = JSON.parse(offerBidRequest);
		console.log(`Received: ${auctionId}, ${price}`);
	}
}
