// To run test data: node testdata-runner.js

"use strict";
var orm = require("orm");
var path = require("path");
var fs = require("fs");
var faker = require('faker');
var Promise = require('promise');
var bcrypt = require("bcrypt");

// Options
var userCount = 10;
var eventCount = 5;

console.log("Connecting to database...");

orm.connect("mysql://devuser@localhost/ILMOV2", function (err, db) {
    if (err) {
        console.error(err);
        reject(new Error(err));
    }

    console.log("Connected to database");

    var modelsFolder = path.join(__dirname, "../../dist/models");
    fs
        .readdirSync(modelsFolder)
        .filter(function (file) {
            return file !== "databasehandler.js";
        })
        .forEach(function (file) {
            db.load(path.join(modelsFolder, file), function (err) {
                if (err) {
                    console.error(err);
                    throw err;
                }
            });

            console.log("Synced " + file + " with the database");
        });

    db.sync(function (err) {
        if (err) {
            throw err;
        }
    });

    var models = db.models;

    insertUsers(models.User)
        .then(v => insertEvents(models.Event))
        .then(v => {
            console.log("Test data has been inserted");
            process.exit();
        });
});

function insertUsers(userModel) {
    console.log("Inserting users...");

    var promises = [];

    for (var i = 0; i < userCount; ++i) {
        var p = new Promise((resolve, reject) => {
            userModel.create({
                email: faker.internet.email(),
                password: "$2a$10$/mWIlM7uqUGK2DdHKOw8UudBs9OqXMuRiMN9u0Kt82PzUysfP6a2W" /* passu */,
                firstname: faker.name.firstName(),
                lastname: faker.name.lastName(),
                dob: faker.date.between(new Date("1950-01-01"), new Date("2000-01-01")),
                allergies: faker.lorem.word() // TODO: Pick allergies from separate list instead of complete random word
            }, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        promises.push(p);
    }

    return Promise.all(promises);
}

function insertEvents(eventModel) {
    console.log("Inserting events");

    var promises = [];

    for (var i = 0; i < eventCount; ++i) {
        var start = new Date();
        var additionalDays = Math.floor(Math.random() * 30) + 1;
        start.setDate(start.getDate() + additionalDays);

        var end = new Date(start);
        end.setDate(end.getDate() + Math.floor(Math.random() * 7) + 1);

        var p = new Promise((resolve, reject) => {
            eventModel.create({
                name: faker.lorem.word() + "-tapahtuma",
                startDate: start,
                endDate: end,
                description: faker.lorem.sentence(),
                registerationOpen: Math.random() < 0.5 ? true : false
            }, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        promises.push(p);
    }

    return Promise.all(promises);
}