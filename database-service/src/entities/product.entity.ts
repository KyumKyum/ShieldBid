import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 } from "uuid";
import { User } from "./user.entity";

@Entity()
export class Product {

    @PrimaryKey()
    id = v4();

    @ManyToOne({entity: () => User})
    owner!: User;

    @Property()
    name!: String;

    @Property()
    type!: String;

    @Property({type: 'date'})
    createdAt = new Date();

    @Property({ type: 'date', onUpdate: () => new Date() })
    updatedAt = new Date();
}