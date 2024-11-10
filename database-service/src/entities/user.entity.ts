import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 } from "uuid";

@Entity()
export class User {

    @PrimaryKey()
    id = v4();

    @Property()
    name!: string;

    @Property({type: 'date'})
    createdAt = new Date();

    @Property({ type: 'date', onUpdate: () => new Date() })
    updatedAt = new Date();

    // Add properties
}