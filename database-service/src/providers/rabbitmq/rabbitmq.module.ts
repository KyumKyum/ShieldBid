import { Module } from "@nestjs/common";
import { DatabaseMQService } from "./rabbitmq.service";
import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { SubscriberModule } from "src/modules/subscriber.module";

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
	providers: [DatabaseMQService],
})
export class DatabaseRabbitMQModule {}
