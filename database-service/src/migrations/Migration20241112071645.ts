import { Migration } from "@mikro-orm/migrations";

export class Migration20241112071645 extends Migration {
	override async up(): Promise<void> {
		this.addSql(
			`alter table "auction" add column "title" varchar(255) not null;`,
		);
	}

	override async down(): Promise<void> {
		this.addSql(`alter table "auction" drop column "title";`);
	}
}
