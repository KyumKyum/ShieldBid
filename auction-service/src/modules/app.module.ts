import { Module } from "@nestjs/common";
import { AppConfigModule } from "src/configs/config.module";
import { AuctionRabbitMQModule } from "src/providers/rabbitmq/rabbitmq.module";
import { AuctionModule } from "./auction.module";
import { CacheModule } from "src/providers/cache/cache.module";

@Module({
	imports: [AppConfigModule, AuctionRabbitMQModule, AuctionModule, CacheModule],
})
export class AppModule {}
