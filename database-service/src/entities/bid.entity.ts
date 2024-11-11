import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 } from "uuid";
import { Auction } from "./auction.entity";
import { CommitmentKey } from "./ck.entity";

@Entity()
export class Bid {
    @PrimaryKey()
    id = v4();

    @ManyToOne({entity: () => Auction})
    auction!: Auction;

    @OneToMany(() => CommitmentKey, ck => ck.bid)
    ck = new Collection<Bid>(this);

    @Property()
    commitment!: String;

    @Property()
    commitmentKey!: String;

    @Property()
    bidPrice!: Number;

    @Property()
    minPrice!: Number;

    @Property()
    randomness!: String;
}