# instructions to run local database
This depends on the way you run postgres, but here is what I did with `pg_ctl`
* `initdb ./classplanner`
* `pg_ctl -D ./classplanner -l psql.log start`
* `createdb classplanner`
* `psql -d classplanner -f dataTable.sql`
* then use this as connection string: `postgresql://localhost:5432/classplanner`
* and in `.env` set `LOCAL_DATABASE=true`
* to delete all tables you can run:
  * `psql`
  * `DROP SCHEMA public CASCADE;`
  * `CREATE SCHEMA public;`