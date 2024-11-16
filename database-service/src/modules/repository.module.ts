import { Module } from "@nestjs/common";
import { ProductRepository } from "src/repository/product.repository";
import { UserRepository } from "src/repository/user.repository";

@Module({
	providers: [UserRepository, ProductRepository],
	exports: [UserRepository, ProductRepository],
})
export class RepositoryModule {}
