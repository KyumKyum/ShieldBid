import { Module } from "@nestjs/common";
import { RepositoryModule } from "../repository.module";
import { SubscriberAuctionService } from "src/services/subscriber.auction.service";

@Module({
	imports: [RepositoryModule],
	providers: [SubscriberAuctionService],
	exports: [SubscriberAuctionService],
})
export class SubscriberAuctionModule {}
