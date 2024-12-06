import { Migration } from "@mikro-orm/migrations";

export class Migration20241117091347 extends Migration {
	override async up(): Promise<void> {
		this.addSql(`alter table "auction" drop column "is_terminated";`);

		this.addSql(
			`alter table "auction" add column "status" varchar(255) not null default 'PENDING';`,
		);
	}

	override async down(): Promise<void> {
		this.addSql(`alter table "auction" drop column "status";`);

		this.addSql(
			`alter table "auction" add column "is_terminated" boolean not null;`,
		);
	}
}
