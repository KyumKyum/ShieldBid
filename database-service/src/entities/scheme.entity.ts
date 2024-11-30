import {
	Collection,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryKey,
	Property,
} from "@mikro-orm/core";
import { v4 } from "uuid";
import { VerificationKey } from "./vk.entity";
import { Auction } from "./auction.entity";
import { Proof } from "./proof.entity";

@Entity()
export class Scheme {
	@PrimaryKey()
	id = v4();

	@OneToMany(
		() => VerificationKey,
		(vk) => vk.scheme,
	)
	vk = new Collection<VerificationKey>(this);

	@OneToMany(
		() => Proof,
		(proof) => proof.scheme,
	)
	proof = new Collection<Proof>(this);

	@ManyToOne({ entity: () => Auction })
	auction!: Auction;

	@Property({ type: "date" })
	createdAt = new Date();

	@Property({ type: "date", onUpdate: () => new Date() })
	updatedAt = new Date();
}
