import { Module } from "@nestjs/common";
import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { RabbitMQService } from "./rabbitmq.service";
import { RoutingKey } from "src/constants/routingKey.constants";

@Module({
	imports: [
		RabbitMQModule.forRoot(RabbitMQModule, {
			exchanges: [
				{
					name: `${process.env.RMQ_EXCHANGE_AUCTION}`,
					type: "direct",
				},
			],
			uri: `amqp://${process.env.RMQ_USER}:${process.env.RMQ_PWD}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`,
			connectionInitOptions: { wait: false },
			queues: [
				{
					name: `${process.env.RMQ_QUEUE}`,
                    exchange: `${process.env.RMQ_EXCHANGE_AUCTION}`,
                    routingKey: RoutingKey.AUCTION,
					options: {durable: true}
					
				},
			]
		}),
	],
	providers: [RabbitMQService],
	exports: [RabbitMQService, RabbitMQModule], // Export both the service and the module
})
export class AuctionRabbitMQModule {}
