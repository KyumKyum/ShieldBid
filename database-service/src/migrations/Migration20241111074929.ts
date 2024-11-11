import { Migration } from '@mikro-orm/migrations';

export class Migration20241111074929 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "scheme" ("id" varchar(255) not null, "auction_id" varchar(255) not null, constraint "scheme_pkey" primary key ("id"));`);

    this.addSql(`create table "verification_key" ("id" varchar(255) not null, "scheme_id" varchar(255) not null, "value" varchar(255) not null, "index" int not null, constraint "verification_key_pkey" primary key ("id"));`);

    this.addSql(`alter table "scheme" add constraint "scheme_auction_id_foreign" foreign key ("auction_id") references "auction" ("id") on update cascade;`);

    this.addSql(`alter table "verification_key" add constraint "verification_key_scheme_id_foreign" foreign key ("scheme_id") references "scheme" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "verification_key" drop constraint "verification_key_scheme_id_foreign";`);

    this.addSql(`drop table if exists "scheme" cascade;`);

    this.addSql(`drop table if exists "verification_key" cascade;`);
  }

}
