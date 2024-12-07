import { Module } from "@nestjs/common";
import { RabbitMQService } from "./rabbitmq.service";
import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
// import { RabbitBidMQService } from "./rabbitmq.bid.service";

@Module({
	imports: [
		RabbitMQModule.forRoot(RabbitMQModule, {
			exchanges: [
				{
					name: `${process.env.RMQ_EXCHANGE_PROCESSING}`,
					type: "direct",
				},
			],
			uri: `amqp://${process.env.RMQ_USER}:${process.env.RMQ_PWD}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`,
			connectionInitOptions: { wait: false },
		}),
	],
	providers: [RabbitMQService],
	exports: [RabbitMQService, RabbitMQModule]
})
export class ProcessingRabbitMQModule {}
