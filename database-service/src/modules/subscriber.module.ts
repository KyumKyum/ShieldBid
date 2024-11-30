import { Module } from "@nestjs/common";
import { SubscriberProductModule } from "./subscriber/subscriber.product.module";
import { SubscriberAuctionModule } from "./subscriber/subscriber.auction.module";

@Module({
	imports: [SubscriberProductModule, SubscriberAuctionModule],
	exports: [SubscriberProductModule, SubscriberAuctionModule],
})
export class SubscriberModule {}
