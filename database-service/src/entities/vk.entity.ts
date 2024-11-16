import {
	Collection,
	Entity,
	ManyToOne,
	PrimaryKey,
	Property,
} from "@mikro-orm/core";
import { v4 } from "uuid";
import { Scheme } from "./scheme.entity";

@Entity()
export class VerificationKey {
	@PrimaryKey()
	id = v4();

	@ManyToOne(() => Scheme)
	scheme = new Collection<Scheme>(this);

	@Property()
	value!: String;

	@Property()
	index!: Number;
}
