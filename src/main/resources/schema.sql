-- DROP TABLE IF EXISTS restaurant_tables;

CREATE TABLE IF NOT EXISTS restaurant_tables (
    tableId INTEGER AUTO_INCREMENT,
    tableCapacity INTEGER,
    tableZone VARCHAR(255),
    tablePreferences VARCHAR(255),
    startingPosX INTEGER,
    startingPosY INTEGER,
    tableWidth INTEGER,
    tableLength INTEGER,
    PRIMARY KEY (tableId)
);
/* DROP TABLE IF EXISTS reservations; */

CREATE TABLE IF NOT EXISTS reservations (
    reservationId INTEGER AUTO_INCREMENT,
    tableId INTEGER,
    reservationFrom TIMESTAMP,
    reservationUntil TIMESTAMP,
    primary key (tableId)
    );