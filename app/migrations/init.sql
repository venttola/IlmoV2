DROP SCHEMA ILMOV2;
DROP USER 'devuser'@'localhost';

CREATE SCHEMA ILMOV2;
CREATE USER 'devuser'@'localhost';

GRANT ALL ON ILMOV2.* TO 'devuser'@'localhost';