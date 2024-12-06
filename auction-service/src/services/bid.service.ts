import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class BidService {
	constructor(private readonly amqp: AmqpConnection) {}

	async offerBid(auctionId: string, price: number) {
		const publishBidData = {
			auctionId,
			price,
		};
		try {
			// await this.amqp.publish(
			// 	process.env.RMQ_EXCHANGE_PROCESSING,
			// 	ProcessingRk.OFFER_BID_REQUEST,
			// 	JSON.stringify(publishBidData),
			// );
		} catch {
			throw new HttpException(
				"Event Propagation Failed: Offer Bid",
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
