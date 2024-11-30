import { Module } from "@nestjs/common";
import { BidController } from "src/controllers/bid.controller";
import { AuctionRabbitMQModule } from "src/providers/rabbitmq/rabbitmq.module";
import { BidService } from "src/services/bid.service";

@Module({
	imports: [AuctionRabbitMQModule],
	controllers: [BidController],
	providers: [BidService],
})
export class BidModule {}
