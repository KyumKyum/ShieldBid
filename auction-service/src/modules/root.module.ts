import { Module } from "@nestjs/common";
import { RootController } from "src/controllers/auction.controller";
import { ProductModule } from "./product.module";
import { AuctionModule } from "./auction.module";

@Module({
	imports: [ProductModule, AuctionModule],
	controllers: [RootController],
	providers: [],
})
export class RootModule {}
