import { Migration } from "@mikro-orm/migrations";

export class Migration20241111085652 extends Migration {
	override async up(): Promise<void> {
		this.addSql(`drop table if exists "proving_key" cascade;`);
	}

	override async down(): Promise<void> {
		this.addSql(
			`create table "proving_key" ("id" varchar(255) not null, "scheme_id" varchar(255) not null, "value" varchar(255) not null, "index" int not null, constraint "proving_key_pkey" primary key ("id"));`,
		);

		this.addSql(
			`alter table "proving_key" add constraint "proving_key_scheme_id_foreign" foreign key ("scheme_id") references "scheme" ("id") on update cascade;`,
		);
	}
}
