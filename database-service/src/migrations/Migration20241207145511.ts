import { Migration } from '@mikro-orm/migrations';

export class Migration20241207145511 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user" ("id" varchar(255) not null, "name" varchar(255) not null, "is_consignor" boolean not null default false, "address" varchar(255) not null, "created_at" date not null, "updated_at" date not null, constraint "user_pkey" primary key ("id"));`);

    this.addSql(`create table "product" ("id" varchar(255) not null, "owner_id" varchar(255) not null, "name" varchar(255) not null, "type" varchar(255) not null, "description" varchar(255) null default '', "created_at" date not null, "updated_at" date not null, constraint "product_pkey" primary key ("id"));`);

    this.addSql(`create table "auction" ("id" varchar(255) not null, "title" varchar(255) not null, "product_id" varchar(255) not null, "min_price" int not null, "status" varchar(255) not null default 'PENDING', "created_at" date not null, "updated_at" date not null, constraint "auction_pkey" primary key ("id"));`);
    this.addSql(`alter table "auction" add constraint "auction_product_id_unique" unique ("product_id");`);

    this.addSql(`create table "scheme" ("id" varchar(255) not null, "auction_id" varchar(255) not null, "created_at" date not null, "updated_at" date not null, constraint "scheme_pkey" primary key ("id"));`);

    this.addSql(`create table "proof" ("id" varchar(255) not null, "scheme_id" varchar(255) not null, "value" varchar(255) not null, "index" int not null, constraint "proof_pkey" primary key ("id"));`);

    this.addSql(`create table "bid" ("id" varchar(255) not null, "auction_id" varchar(255) not null, "commitment" varchar(255) not null, "commitment_key" varchar(255) not null, "bid_price" int not null, "randomness" varchar(255) not null, "created_at" date not null, "updated_at" date not null, constraint "bid_pkey" primary key ("id"));`);

    this.addSql(`create table "commitment_key" ("id" varchar(255) not null, "bid_id" varchar(255) not null, "value" varchar(255) not null, "is_first" boolean not null, constraint "commitment_key_pkey" primary key ("id"));`);

    this.addSql(`create table "verification_key" ("id" varchar(255) not null, "scheme_id" varchar(255) not null, "value" varchar(255) not null, "index" int not null, constraint "verification_key_pkey" primary key ("id"));`);

    this.addSql(`alter table "product" add constraint "product_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "auction" add constraint "auction_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;`);

    this.addSql(`alter table "scheme" add constraint "scheme_auction_id_foreign" foreign key ("auction_id") references "auction" ("id") on update cascade;`);

    this.addSql(`alter table "proof" add constraint "proof_scheme_id_foreign" foreign key ("scheme_id") references "scheme" ("id") on update cascade;`);

    this.addSql(`alter table "bid" add constraint "bid_auction_id_foreign" foreign key ("auction_id") references "auction" ("id") on update cascade;`);

    this.addSql(`alter table "commitment_key" add constraint "commitment_key_bid_id_foreign" foreign key ("bid_id") references "bid" ("id") on update cascade;`);

    this.addSql(`alter table "verification_key" add constraint "verification_key_scheme_id_foreign" foreign key ("scheme_id") references "scheme" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "product" drop constraint "product_owner_id_foreign";`);

    this.addSql(`alter table "auction" drop constraint "auction_product_id_foreign";`);

    this.addSql(`alter table "scheme" drop constraint "scheme_auction_id_foreign";`);

    this.addSql(`alter table "bid" drop constraint "bid_auction_id_foreign";`);

    this.addSql(`alter table "proof" drop constraint "proof_scheme_id_foreign";`);

    this.addSql(`alter table "verification_key" drop constraint "verification_key_scheme_id_foreign";`);

    this.addSql(`alter table "commitment_key" drop constraint "commitment_key_bid_id_foreign";`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop table if exists "product" cascade;`);

    this.addSql(`drop table if exists "auction" cascade;`);

    this.addSql(`drop table if exists "scheme" cascade;`);

    this.addSql(`drop table if exists "proof" cascade;`);

    this.addSql(`drop table if exists "bid" cascade;`);

    this.addSql(`drop table if exists "commitment_key" cascade;`);

    this.addSql(`drop table if exists "verification_key" cascade;`);
  }

}
