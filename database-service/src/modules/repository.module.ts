import { Module } from "@nestjs/common";
import { AuctionRepository } from "src/repository/auction.repository";
import { ProductRepository } from "src/repository/product.repository";
import { UserRepository } from "src/repository/user.repository";

@Module({
	providers: [UserRepository, ProductRepository, AuctionRepository],
	exports: [UserRepository, ProductRepository, AuctionRepository],
})
export class RepositoryModule {}
