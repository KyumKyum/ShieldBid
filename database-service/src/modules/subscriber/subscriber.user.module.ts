import { Module } from "@nestjs/common";
import { RepositoryModule } from "../repository.module";
import { SubscriberUserService } from "src/services/subscriber.user.service";

@Module({
	imports: [RepositoryModule],
	providers: [SubscriberUserService],
	exports: [SubscriberUserService],
})
export class SubscriberUserModule {}
