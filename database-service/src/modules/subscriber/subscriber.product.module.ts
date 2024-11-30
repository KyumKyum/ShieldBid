import { Module } from "@nestjs/common";
import { SubscriberProductService } from "src/services/subscriber.product.service";
import { RepositoryModule } from "../repository.module";

@Module({
	imports: [RepositoryModule],
	providers: [SubscriberProductService],
	exports: [SubscriberProductService],
})
export class SubscriberProductModule {}
