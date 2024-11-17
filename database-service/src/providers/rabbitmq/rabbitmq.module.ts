import { Module } from "@nestjs/common";
import { DatabaseProductMQService } from "./rabbitmq.product.service";
import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { SubscriberModule } from "src/modules/subscriber.module";
import { DatabaseAuctionMQService } from "./rabbitmq.auction.service";

@Module({
	imports: [
		RabbitMQModule.forRoot(RabbitMQModule, {
			exchanges: [
				{
					name: `${process.env.RMQ_EXCHANGE_DB}`,
					type: "topic",
				},
			],
			uri: `amqp://${process.env.RMQ_USER}:${process.env.RMQ_PWD}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`,
			connectionInitOptions: { wait: false },
		}),
		SubscriberModule,
	],
	providers: [DatabaseProductMQService, DatabaseAuctionMQService],
})
export class DatabaseRabbitMQModule {}
