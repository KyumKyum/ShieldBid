import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 } from "uuid";
import { Scheme } from "./scheme.entity";

@Entity()
export class ProvingKey {
    @PrimaryKey()
    id = v4();

    @ManyToOne(() => Scheme)
    scheme!: Scheme

    @Property()
    value!: String;

    @Property()
    index!: Number;
}