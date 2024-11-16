import { Migration } from "@mikro-orm/migrations";

export class Migration20241111093907 extends Migration {
	override async up(): Promise<void> {
		this.addSql(`alter table "auction" add column "min_price" int not null;`);

		this.addSql(
			`alter table "scheme" add column "created_at" date not null, add column "updated_at" date not null;`,
		);

		this.addSql(`alter table "bid" drop column "min_price";`);

		this.addSql(
			`alter table "bid" add column "created_at" date not null, add column "updated_at" date not null;`,
		);
	}

	override async down(): Promise<void> {
		this.addSql(`alter table "auction" drop column "min_price";`);

		this.addSql(
			`alter table "scheme" drop column "created_at", drop column "updated_at";`,
		);

		this.addSql(
			`alter table "bid" drop column "created_at", drop column "updated_at";`,
		);

		this.addSql(`alter table "bid" add column "min_price" int not null;`);
	}
}
