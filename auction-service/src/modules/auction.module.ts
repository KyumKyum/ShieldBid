import { Module } from "@nestjs/common";
import { AuctionRabbitMQModule } from "src/providers/rabbitmq/rabbitmq.module";
import { AuctionService } from "src/services/auction.service";

@Module({
	imports: [AuctionRabbitMQModule],
	providers: [AuctionService],
	exports: [AuctionService],
})
export class AuctionModule {}
