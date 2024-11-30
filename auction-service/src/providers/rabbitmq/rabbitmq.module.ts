import { Module } from "@nestjs/common";
import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { RabbitAuctionMQService } from "./rabbitmq.auction.service";

@Module({
	imports: [
		RabbitMQModule.forRoot(RabbitMQModule, {
			exchanges: [
				{
					name: `${process.env.RMQ_EXCHANGE_AUCTION}`,
					type: "topic",
				},
			],
			uri: `amqp://${process.env.RMQ_USER}:${process.env.RMQ_PWD}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`,
			connectionInitOptions: { wait: false },
		}),
	],
	providers: [RabbitAuctionMQService],
	exports: [RabbitAuctionMQService, RabbitMQModule], // Export both the service and the module
})
export class AuctionRabbitMQModule {}
