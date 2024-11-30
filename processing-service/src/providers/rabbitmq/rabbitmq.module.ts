import { Module } from "@nestjs/common";
import { RabbitAuctionMQService } from "./rabbitmq.auction.service";
import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { RabbitBidMQService } from "./rabbitmq.bid.service";

@Module({
	imports: [
		RabbitMQModule.forRoot(RabbitMQModule, {
			exchanges: [
				{
					name: `${process.env.RMQ_EXCHANGE_PROCESSING}`,
					type: "topic",
				},
			],
			uri: `amqp://${process.env.RMQ_USER}:${process.env.RMQ_PWD}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`,
			connectionInitOptions: { wait: false },
		}),
	],
	providers: [RabbitAuctionMQService, RabbitBidMQService],
})
export class ProcessingRabbitMQModule {}
