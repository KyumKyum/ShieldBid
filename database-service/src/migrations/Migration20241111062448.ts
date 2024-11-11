import { Migration } from '@mikro-orm/migrations';

export class Migration20241111062448 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "product" ("id" varchar(255) not null, "owner_id" varchar(255) not null, "name" varchar(255) not null, "type" varchar(255) not null, constraint "product_pkey" primary key ("id"));`);

    this.addSql(`alter table "product" add constraint "product_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "product" cascade;`);
  }

}
