import { Module } from "@nestjs/common";
import { SubscriberProductModule } from "./subscriber/subscriber.product.module";
import { SubscriberAuctionModule } from "./subscriber/subscriber.auction.module";
import { SubscriberUserModule } from "./subscriber/subscriber.user.module";

@Module({
	imports: [
		SubscriberProductModule,
		SubscriberAuctionModule,
		SubscriberUserModule,
	],
	exports: [
		SubscriberProductModule,
		SubscriberAuctionModule,
		SubscriberUserModule,
	],
})
export class SubscriberModule {}
