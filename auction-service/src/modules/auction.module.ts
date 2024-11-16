import { Module } from "@nestjs/common";
import { AuctionController } from "src/controllers/auction.controller";
import { ProductModule } from "./product.module";
import { ProductService } from "src/services/product.service";
import { CacheModule } from "src/providers/cache/cache.module";
import { CacheService } from "src/providers/cache/cache.service";

@Module({
	imports: [ProductModule],
	controllers: [AuctionController],
	providers: [],
})
export class AuctionModule {}
