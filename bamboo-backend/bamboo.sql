\echo 'Delete and recreate bamboo db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE bamboo;
CREATE DATABASE bamboo;
\connect bamboo

\i bamboo-schema.sql

\echo 'Delete and recreate jobly_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE bamboo_test;
CREATE DATABASE bamboo_test;
\connect bamboo_test

\i bamboo-schema.sql