import { Migration } from "@mikro-orm/migrations";

export class Migration20241110163029 extends Migration {
	override async up(): Promise<void> {
		this.addSql(
			`create table "user" ("id" varchar(255) not null, "name" varchar(255) not null, "created_at" date not null, "updated_at" date not null, constraint "user_pkey" primary key ("id"));`,
		);
	}

	override async down(): Promise<void> {
		this.addSql(`drop table if exists "user" cascade;`);
	}
}
