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
export class RabbitMQService {

	constructor(
		private readonly amqp: AmqpConnection,
	){}

private async deployAuctionContract(event: AuctionContractRequest) {
    const {auctionId, consignorAddress} = event;
    const scriptPath = path.resolve(process.cwd(), 'src/scripts/deploy_auction.sh');
    
    try {
        // Export the environment variable
        childProcess.execSync(`export CONTRACT_DIR=${process.env.CONTRACT_DIR}`);

        // Use execFile instead of spawn for better error handling
        return new Promise((resolve, reject) => {
            const child = childProcess.execFile(
                'sh', 
                [scriptPath, auctionId, consignorAddress], 
                (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Deployment script failed: ${error.message}`);
                        reject(error);
                        return;
                    }

                    // If script executed successfully, publish the message
                    const msg: CommonMsg = {
                        route: DatabaseRoute.START_AUCTION_REQUEST,
                        payload: auctionId
                    };

					console.log(msg)

                    this.amqp.publish(
                        process.env.RMQ_EXCHANGE_DATABASE,
                        RoutingKey.DATABASE,
                        JSON.stringify(msg)
                    ).then(() => {
                        console.log(`Successfully deployed auction contract for ID: ${auctionId}`);
                        resolve(true);
                    }).catch(publishError => {
                        console.error(`Failed to publish message: ${publishError}`);
                        reject(publishError);
                    });
                }
            );
        });
    } catch (error) {
        console.error(`Deployment preparation failed: ${error.message}`);
        throw error;
    }
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
				await this.deployAuctionContract(payload as AuctionContractRequest)
				break;
			}
		}
 
	}
	
	

	//* Add Subscriber in here
}
