import {
	Collection,
	Entity,
	ManyToOne,
	PrimaryKey,
	Property,
} from "@mikro-orm/core";
import { Scheme } from "./scheme.entity";
import { v4 } from "uuid";

@Entity()
export class Proof {
	@PrimaryKey()
	id = v4();

	@ManyToOne(() => Scheme)
	scheme = new Collection<Scheme>(this);

	@Property()
	value!: String;

	@Property()
	index!: Number;
}
