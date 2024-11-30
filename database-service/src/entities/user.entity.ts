import {
	Collection,
	Entity,
	OneToMany,
	PrimaryKey,
	Property,
} from "@mikro-orm/core";
import { v4 } from "uuid";
import { Product } from "./product.entity";

@Entity()
export class User {
	@PrimaryKey()
	id = v4();

	@Property()
	name!: string;

	@Property({ default: false })
	isConsignor: boolean;

	@OneToMany(
		() => Product,
		(product) => product.owner,
	)
	product = new Collection<Product>(this);

	@Property({ type: "date" })
	createdAt = new Date();

	@Property({ type: "date", onUpdate: () => new Date() })
	updatedAt = new Date();

	// Add properties
}
