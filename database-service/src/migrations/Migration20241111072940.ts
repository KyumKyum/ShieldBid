import { Migration } from '@mikro-orm/migrations';

export class Migration20241111072940 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "bid" ("id" varchar(255) not null, "auction_id" varchar(255) not null, "commitment" varchar(255) not null, "commitment_key" varchar(255) not null, "bid_price" int not null, constraint "bid_pkey" primary key ("id"));`);

    this.addSql(`alter table "bid" add constraint "bid_auction_id_foreign" foreign key ("auction_id") references "auction" ("id") on update cascade;`);

    this.addSql(`alter table "auction" drop constraint "auction_product_id_id_foreign";`);

    this.addSql(`alter table "auction" drop constraint "auction_product_id_id_unique";`);

    this.addSql(`alter table "auction" rename column "product_id_id" to "product_id";`);
    this.addSql(`alter table "auction" add constraint "auction_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;`);
    this.addSql(`alter table "auction" add constraint "auction_product_id_unique" unique ("product_id");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "bid" cascade;`);

    this.addSql(`alter table "auction" drop constraint "auction_product_id_foreign";`);

    this.addSql(`alter table "auction" drop constraint "auction_product_id_unique";`);

    this.addSql(`alter table "auction" rename column "product_id" to "product_id_id";`);
    this.addSql(`alter table "auction" add constraint "auction_product_id_id_foreign" foreign key ("product_id_id") references "product" ("id") on update cascade;`);
    this.addSql(`alter table "auction" add constraint "auction_product_id_id_unique" unique ("product_id_id");`);
  }

}
