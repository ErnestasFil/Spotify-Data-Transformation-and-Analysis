import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tracks', (table) => {
    table.string('id').primary();
    table.text('name').notNullable();
    table.specificType('artists', 'text[]').notNullable();
    table.specificType('id_artists', 'text[]').notNullable();
    table.integer('duration_ms').notNullable();
    table.integer('year').notNullable();
    table.integer('month').notNullable();
    table.integer('day').notNullable();
    table.integer('popularity').notNullable();
    table.float('energy').notNullable();
    table.string('danceability').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('tracks');
}
