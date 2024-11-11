import { Migration } from '@mikro-orm/migrations';

export class Migration20241111080208 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "commitment_key" ("id" varchar(255) not null, "bid_id" varchar(255) not null, "value" varchar(255) not null, "is_first" boolean not null, constraint "commitment_key_pkey" primary key ("id"));`);

    this.addSql(`alter table "commitment_key" add constraint "commitment_key_bid_id_foreign" foreign key ("bid_id") references "bid" ("id") on update cascade;`);

    this.addSql(`alter table "bid" add column "min_price" int not null, add column "randomness" varchar(255) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "commitment_key" cascade;`);

    this.addSql(`alter table "bid" drop column "min_price", drop column "randomness";`);
  }

}
