import { Entity, ManyToOne, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 } from "uuid";
import { User } from "./user.entity";
import { Auction } from "./auction.entity";

@Entity()
export class Product {
	@PrimaryKey()
	id = v4();

	@OneToOne(() => Auction, auction => auction.product, {nullable: true})
 	auction?: Auction;

	@ManyToOne({ entity: () => User })
	owner!: User;

	@Property()
	name!: string;

	@Property()
	type!: string;

	@Property({ nullable: true, default: ""})
	description?: string;

	@Property({ type: "date" })
	createdAt = new Date();

	@Property({ type: "date", onUpdate: () => new Date() })
	updatedAt = new Date();
}
