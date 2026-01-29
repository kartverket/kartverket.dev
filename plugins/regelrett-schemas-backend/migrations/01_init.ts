/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex: any) {
  return knex.schema.createTable('regelrett_schemas', (table: any) => {
    table.increments('id').primary();
    table.string('function_ref', 255).notNullable();
    table.string('context_id', 255).notNullable();
  });
};

exports.down = function down(knex: any) {};
