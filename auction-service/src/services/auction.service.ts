import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CorrelationService } from "./correlation.service";
import { TiredOfWaitingError } from "src/exceptions/correlation.exception";
import { CommonMsg } from "src/dto/commonMsg.dto";
import { DatabaseRoute } from "src/constants/databaseRoute.constants copy";
import { RoutingKey } from "src/constants/routingKey.constants";

@Injectable()
export class AuctionService {
	constructor(
		private readonly amqp: AmqpConnection,
		private readonly correlationService: CorrelationService
	) {}

	async queryAuctionList() {
		try{
			// const cid = `cid_${this.correlationService.generateId()}`;
			// this.amqp.publish(
			// 	process.env.RMQ_EXCHANGE_DB,
			// 	DatabaseRk.AUCTION_QUERY_ALL,
			// 	cid
			// )

			// const res = await this.correlationService.waitAndRetrieve(cid);


		}catch(e) {

			if(e instanceof TiredOfWaitingError){
				throw new HttpException(
					"Timeout! (5 sec)",
					HttpStatus.REQUEST_TIMEOUT
				)
			}

			throw new HttpException(
				"Event Propagetion Failed: Query AuctionList",
				HttpStatus.INTERNAL_SERVER_ERROR
			)
		}
	}

	async requestAuctionTermination(auctionId: string) {
		
		const msg: CommonMsg = {
			route: DatabaseRoute.TERMINATE_AUCTION_REQUEST,
			payload: auctionId
		}
		
		try {
			await this.amqp.publish(
				process.env.RMQ_EXCHANGE_DB,
				RoutingKey.DATABASE,
				JSON.stringify(msg),
			);
		} catch {
			throw new HttpException(
				"Event Propagation Failed: Auction Termination",
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
