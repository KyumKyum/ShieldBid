import {
	Collection,
	Entity,
	OneToMany,
	OneToOne,
	PrimaryKey,
	Property,
} from "@mikro-orm/core";
import { v4 } from "uuid";
import { Product } from "./product.entity";
import { Scheme } from "./scheme.entity";

@Entity()
export class Auction {
	@PrimaryKey()
	id = v4();

	@Property()
	title: string;

	@OneToOne(() => Product, product => product.auction, {
		owner: true,
	})
  	product!: Product;

	@OneToMany(
		() => Scheme,
		(scheme) => scheme.auction,
	)
	scheme = new Collection<Scheme>(this);

	@Property()
	minPrice!: number;

	@Property({ default: "PENDING" })
	status: "PENDING" | "START" | "TERMINATED";

	@Property({ type: "date" })
	createdAt = new Date();

	@Property({ type: "date", onUpdate: () => new Date() })
	updatedAt = new Date();
}
