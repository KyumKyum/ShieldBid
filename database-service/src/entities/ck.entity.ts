import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 } from "uuid";
import { Bid } from "./bid.entity";

@Entity()
export class CommitmentKey {
	@PrimaryKey()
	id = v4();

	@ManyToOne(() => Bid)
	bid!: Bid;

	@Property()
	value!: String;

	@Property()
	isFirst!: Boolean;
}
