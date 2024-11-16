import { Module } from "@nestjs/common";
import { AppConfigModule } from "src/configs/config.module";
import { DatabaseRabbitMQModule } from "src/providers/rabbitmq/rabbitmq.module";
import { DbModule } from "src/providers/db/db.module";

@Module({
	imports: [AppConfigModule, DatabaseRabbitMQModule, DbModule],
})
export class AppModule {}
