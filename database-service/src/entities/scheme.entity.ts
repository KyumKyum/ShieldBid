import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey } from "@mikro-orm/core";
import { v4 } from "uuid";
import { VerificationKey } from "./vk.entity";
import { Auction } from "./auction.entity";
import { ProvingKey } from "./pk.entity";
import { Proof } from "./proof.entity";

@Entity()
export class Scheme {
    @PrimaryKey()
    id = v4();

    @OneToMany(() => VerificationKey, vk => vk.scheme)
    vk = new Collection<VerificationKey>(this);

    @OneToMany(() => ProvingKey, pk => pk.scheme)
    pk = new Collection<ProvingKey>(this);

    @OneToMany(() => Proof, proof => proof.scheme)
    proof = new Collection<Proof>(this);

    @ManyToOne({entity: () => Auction})
    auction!: Auction;
}