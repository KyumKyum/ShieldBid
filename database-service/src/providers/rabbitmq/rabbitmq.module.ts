import { Module } from "@nestjs/common";
import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { CacheModule } from "../cache/cache.module";
import { SubscriberAuctionService } from "src/services/subscriber.auction.service";
import { SubscriberProductService } from "src/services/subscriber.product.service";
import { SubscriberUserService } from "src/services/subscriber.user.service";
import { SubscriberModule } from "src/modules/subscriber.module";

@Module({
	imports: [
		RabbitMQModule.forRoot(RabbitMQModule, {
			exchanges: [
				{
					name: `${process.env.RMQ_EXCHANGE_DB}`,
					type: "direct",
				},
			],
			uri: `amqp://${process.env.RMQ_USER}:${process.env.RMQ_PWD}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`,
			connectionInitOptions: { wait: false },
		}),
		CacheModule,
		SubscriberModule
	],
	providers: [],
})
export class DatabaseRabbitMQModule {}
