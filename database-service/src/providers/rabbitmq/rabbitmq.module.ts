import { Module } from "@nestjs/common";
import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { CacheModule } from "../cache/cache.module";
import { SubscriberModule } from "src/modules/subscriber.module";
import { RoutingKey } from "src/constants/routingKey.constants";
import { RabbitMQService } from "./rabbitmq.service";

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
			queues: [
				{
					name: `${process.env.RMQ_QUEUE}`,
					exchange: `${process.env.RMQ_EXCHANGE_DB}`,
                    routingKey: RoutingKey.DATABASE,
					options: { durable: true },
				},
			],
		}),
		CacheModule,
		SubscriberModule
	],
	providers: [RabbitMQService],
	exports: [RabbitMQService, RabbitMQModule]
})
export class DatabaseRabbitMQModule {}
