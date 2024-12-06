import { Module } from "@nestjs/common";
import { AuctionRabbitMQModule } from "src/providers/rabbitmq/rabbitmq.module";
import { AuctionService } from "src/services/auction.service";
import { CorrelationModule } from "./correlation.module";

@Module({
	imports: [AuctionRabbitMQModule, CorrelationModule],
	providers: [AuctionService],
	exports: [AuctionService],
})
export class AuctionModule {}
