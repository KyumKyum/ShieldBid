import { AmqpConnection, RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { ProcessingRk } from "src/constants/processingRk.constants";
import * as childProcess from 'node:child_process';
import * as path from 'node:path/posix';
import { AuctionContractRequest } from "src/dto/auction.dto";
import { AuctionRk } from "src/constants/auctionRk.constants";

@Injectable()
export class RabbitAuctionMQService {

	constructor(
		private readonly amqp: AmqpConnection,
	){}

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
		const {auctionId, ownerId} = JSON.parse(auctionContractReq) as AuctionContractRequest;
		const scriptPath = path.resolve(process.cwd(), 'src/scripts/deploy_auction.sh');
		childProcess.exec(`export CONTRACT_DIR=${process.env.CONTRACT_DIR}`)

		const child = childProcess.spawn(`sh ${scriptPath}`, [auctionId, ownerId], {
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
		await this.amqp.publish(
			process.env.RMQ_EXCHANGE_AUCTION,
			AuctionRk.AUCTION_DEPLOYED,
			auctionId
		)
	}

	//* Add Subscriber in here
}
