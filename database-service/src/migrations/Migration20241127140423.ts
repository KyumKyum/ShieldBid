import { Migration } from '@mikro-orm/migrations';

export class Migration20241127140423 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "auction" drop column "description";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "auction" add column "description" varchar(255) null;`);
  }

}
