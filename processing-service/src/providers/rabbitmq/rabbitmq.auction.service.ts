import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { ProcessingRk } from "src/constants/processingRk.constants";
import { AuctionContractRequest } from "src/dto/auction.dto";

@Injectable()
export class RabbitAuctionMQService {
	@RabbitSubscribe({
		exchange: `${process.env.RMQ_EXCHANGE_PROCESSING}`,
		routingKey: ProcessingRk.AUCTION_CONTRACT_REQUEST,
		queue: `${process.env.RMQ_QUEUE}`,
		// Acknowledge messages manually
		errorHandler: (channel, msg, error) => {
			console.error("Error processing message: ", JSON.stringify(msg));
			console.error(error);
			// Negative acknowledgment with requeueing in case of error
			channel.nack(msg, false, true);
		},
	})
	public async auctionContractRequestHandler(auctionContractReq: string) {
		console.log(`Received message: ${auctionContractReq}`);
	}

	//* Add Subscriber in here
}
