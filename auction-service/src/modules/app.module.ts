import { Module } from "@nestjs/common";
import { AppConfigModule } from "src/configs/config.module";
import { AuctionRabbitMQModule } from "src/providers/rabbitmq/rabbitmq.module";
import { RootModule } from "./root.module";
import { CacheModule } from "src/providers/cache/cache.module";

@Module({
	imports: [AppConfigModule, AuctionRabbitMQModule, RootModule, CacheModule],
})
export class AppModule {}
