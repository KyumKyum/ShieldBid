import { Migration } from '@mikro-orm/migrations';

export class Migration20241127140321 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" add column "is_consignor" boolean not null default false;`);

    this.addSql(`alter table "auction" add column "description" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" drop column "is_consignor";`);

    this.addSql(`alter table "auction" drop column "description";`);
  }

}
