import { AmqpConnection, RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import * as childProcess from 'node:child_process';
import * as path from 'node:path/posix';
import { AuctionContractRequest } from "src/dto/auction.dto";
import { RoutingKey } from "src/constants/routingKey.constants";
import { CommonMsg } from "src/dto/commonMsg.dto";
import { ProcessingRoute } from "src/constants/processingRoute.constants";
import { DatabaseRoute } from "src/constants/databaseRoute.constants copy";

@Injectable()
export class RabbitAuctionMQService {

	constructor(
		private readonly amqp: AmqpConnection,
	){}

	private async deployAuctionContract(event: AuctionContractRequest) {
		const {auctionId, consignorAddress} = event
		const scriptPath = path.resolve(process.cwd(), 'src/scripts/deploy_auction.sh');
		childProcess.exec(`export CONTRACT_DIR=${process.env.CONTRACT_DIR}`)

		const child = childProcess.spawn(`sh ${scriptPath}`, [auctionId, consignorAddress], {
			stdio: 'inherit', // Inherit stdio so output/error logs are shown in the parent process
			shell: true, // Enable shell to ensure the script runs correctly
		  });
		  
		  child.on('close', (code) => {
			console.log(`Script exited with code ${code}`);
		  });
		  
		  child.on('error', (err) => {
			console.error(`Failed to start script: ${err.message}`);
		  });

		//* Deployed
		const msg: CommonMsg = {
			route: DatabaseRoute.START_AUCTION_REQUEST,
			payload: auctionId
		}

		await this.amqp.publish(
			process.env.RMQ_EXCHANGE_DATABASE,
			RoutingKey.DATABASE,
			JSON.stringify(msg)
		)
	}

	@RabbitSubscribe({
		exchange: `${process.env.RMQ_EXCHANGE_PROCESSING}`,
		routingKey: RoutingKey.PROCESSING,
		queue: `${process.env.RMQ_QUEUE}`,
	})
	public async processingAuctionHandler(msg: string) {
		const { route, payload } = JSON.parse(msg) as CommonMsg;

		switch (route) {
			case ProcessingRoute.DEPLOY_AUCTION_REQUEST: {
				await this.deployAuctionContract(JSON.parse(payload) as AuctionContractRequest)
				break;
			}
		}
 
	}
	
	

	//* Add Subscriber in here
}
