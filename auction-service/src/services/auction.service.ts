import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DatabaseRk } from "src/constants/databaseRk.constants";

@Injectable()
export class AuctionService {
	constructor(private readonly amqp: AmqpConnection) {}

	async requestAuctionTermination(auctionId: string) {
		try {
			await this.amqp.publish(
				process.env.RMQ_EXCHANGE_DB,
				DatabaseRk.AUCTION_TERMINATE,
				auctionId,
			);
		} catch {
			throw new HttpException(
				"Event Propagation Failed: Auction Termination",
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
