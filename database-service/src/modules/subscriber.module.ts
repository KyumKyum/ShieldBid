import { Module } from "@nestjs/common";
import { SubscriberProductModule } from "./subscriber/subscriber.product.module";

@Module({
	imports: [SubscriberProductModule],
	exports: [SubscriberProductModule],
})
export class SubscriberModule {}
