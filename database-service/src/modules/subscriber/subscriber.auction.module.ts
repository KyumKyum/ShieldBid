import { Module } from "@nestjs/common";
import { RepositoryModule } from "../repository.module";
import { SubscriberAuctionService } from "src/services/subscriber.auction.service";
import { SubscriberUserModule } from "./subscriber.user.module";

@Module({
	imports: [RepositoryModule, SubscriberUserModule],
	providers: [SubscriberAuctionService],
	exports: [SubscriberAuctionService],
})
export class SubscriberAuctionModule {}
