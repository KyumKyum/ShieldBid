import { Module } from "@nestjs/common";
import { AuctionRabbitMQModule } from "src/providers/rabbitmq/rabbitmq.module";
import { ProductService } from "src/services/product.service";

@Module({
	imports: [AuctionRabbitMQModule],
	providers: [ProductService],
	exports: [ProductService],
})
export class ProductModule {}
