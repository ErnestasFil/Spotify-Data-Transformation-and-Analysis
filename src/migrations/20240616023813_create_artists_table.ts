import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('artists', (table) => {
    table.string('id').primary();
    table.string('name').notNullable();
    table.float('followers').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('artists');
}
