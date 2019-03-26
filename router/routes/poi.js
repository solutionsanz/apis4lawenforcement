var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var config = require("../../config");
var http = require('http');
var https = require('https');

var funct = require('./functions');

//CRI change:
var bodyParser = require('body-parser');

// Configure application routes
module.exports = function (app) {

    // CRI change to allow JSON parsing from requests:    
    app.use(bodyParser.json()); // Support for json encoded bodies 
    app.use(bodyParser.urlencoded({
        extended: true
    })); // Support for encoded bodies

    function log(apiMethod, apiUri, msg) {
        console.log("[" + apiMethod + "], [" + apiUri + "], [" + msg + "], [UTC:" +
            new Date().toISOString().replace(/\..+/, '') + "]");
    }

    /**
     * Adding APIs:
     * 
     */

    /* GET /tasks */
    app.get('/poi', function (req, res) {

        var firstName = req.query.fname;
        var lastName = req.query.lastName;
        var dateOfBirth = req.query.dateOfBirth;

        var query;
        var params = [];

        if ((firstName == null || firstName == undefined) && (lastName == null || lastName == undefined) && (dateOfBirth == null || dateOfBirth == undefined)) {

            query = `SELECT * FROM POI`;

        } else if ((firstName != null && firstName != undefined) && (lastName == null || lastName == undefined) && (dateOfBirth == null || dateOfBirth == undefined)) {

            query = `SELECT * FROM POI WHERE FNAME = :firstName`;
            params = [firstName];

        } else if ((firstName == null || firstName == undefined) && (lastName != null && lastName != undefined) && (dateOfBirth == null || dateOfBirth == undefined)) {

            query = `SELECT * FROM POI WHERE LNAME = :lsa`;
            params = [lastName];

        } else if ((firstName == null || firstName == undefined) && (lastName == null && lastName == undefined) && (dateOfBirth != null || dateOfBirth != undefined)) {

            query = `SELECT * FROM POI WHERE DOB = :dateOfBirth`;
            params = [dateOfBirth];

        } else if ((firstName != null || firstName != undefined) && (lastName != null && lastName != undefined) && (dateOfBirth == null || dateOfBirth == undefined)) {

            query = `SELECT * FROM POI WHERE FNAME = :firstName AND LNAME = :lastName`;
            params = [firstName, lastName];

        } else if ((firstName == null || firstName == undefined) && (lastName != null && lastName != undefined) && (dateOfBirth != null || dateOfBirth != undefined)) {

            query = `SELECT * FROM POI WHERE LNAME = :lastName AND DOB = :dateOfBirth`;
            params = [lastName, dateOfBirth];

        } else if ((firstName != null || firstName != undefined) && (lastName == null && lastName == undefined) && (dateOfBirth != null || dateOfBirth != undefined)) {

            query = `SELECT * FROM POI WHERE FNAME = :firstName AND DOB = :dateOfBirth`;
            params = [firstName, dateOfBirth];

        } else if ((firstName != null && firstName != undefined) && (lastName != null && lastName != undefined) && (dateOfBirth != null || dateOfBirth != undefined)) {

            query = `SELECT * FROM POI WHERE FNAME = :firstName AND LNAME = :lname AND DOB = :dateOfBirth`;
            params = [firstName, lastName, dateOfBirth];

        } else {

            log("GET", "/poi", "Invalid logical conditions. Please verify.");
            res.status(400).end("Invalid logical conditions. Please verify."); //Bad request...
            return;
        }


        log("GET", "/poi", "Query to execute [" + query + "]");


        funct.getDataGeneric(query, params, function (resMetadata, resData) {

            log("GET", "/poi", "Found: [" + JSON.stringify({
                resData
            }) + "]");

            // In order to comply with the API documentation, 
            // let's validate if an Array was return, in which
            // case we simply return it.
            // Otherwise we will create an array of 1 element
            // in the response.
            var arrResult = [];
            var renderedResult = {};
            if (resMetadata != null && resMetadata != undefined && resData != null && resData != undefined) {

                for (var x in resData) {

                    // Starting new order:
                    renderedResult = {};
                    for (var y in resData[x]) {


                        col = resMetadata[y].name.toLowerCase();
                        colValue = resData[x][y];
                        renderedResult[col] = colValue;

                        console.log("col is [" + col + "], colValue is [" + colValue + "]");
                    }
                    // Adding full record to array:
                    console.log("record is [" + JSON.stringify(renderedResult) + ']');
                    arrResult.push(renderedResult);
                }

            }

            // Returning result
            res.send({
                "PersonsOfInterest": arrResult
            });
        });
    });


    /* GET /poi/:id */
    app.get('/poi/:id', function (req, res) {

        var id = req.params.id; //gid to filter by (if given)

        var query = `SELECT * FROM POI WHERE ID = :id`;
        var params = [];

        if (id != null && id != undefined) {

            params = [id];

        } else {
            res.status(400).end("id parameter empty or invalid. Verify parameters and try again."); //Bad request...
            return;
        }

        log("GET", "/poi", "id received [" + id + "]");


        funct.getDataGeneric(query, params, function (resMetadata, resData) {

            log("GET", "/poi", "Found: [" + JSON.stringify({
                resData
            }) + "]");

            // In order to comply with the API documentation, 
            // let's validate if an Array was return, in which
            // case we simply return it.
            // Otherwise we will create an array of 1 element
            // in the response.
            // var result = [];
            var renderedResult = {};
            if (resMetadata != null && resMetadata != undefined && resData != null && resData != undefined) {

                for (var x in resData) {

                    // Starting new order:
                    renderedResult = {};
                    for (var y in resData[x]) {


                        col = resMetadata[y].name.toLowerCase();
                        colValue = resData[x][y];
                        renderedResult[col] = colValue;

                        console.log("col is [" + col + "], colValue is [" + colValue + "]");
                    }
                    // Adding full record to array:
                    console.log("record is [" + JSON.stringify(renderedResult) + ']');
                    // result.push(renderedResult);
                }

            }

            // Returning result
            res.send({
                "PersonOfInterest": renderedResult
            });
        });
    });

    /* POST /tasks */
    app.post('/poi', function (req, res) {

        // // Retrieve Records to be inserted from Body:
        var poi = req.body.PersonOfInterest;

        if (poi == null || poi == undefined) {
            log("POST", "/poi", "No data received... Please verify and try again.");
            res.status(400).end("No data received... Please verify and try again."); //Bad request...
            return;
        }

        var FNAME = (poi.fname == null || poi.fname == undefined) ? "Undefined" : poi.fname;
        var LNAME = (poi.lname == null || poi.lname == undefined) ? "Undefined" : poi.lname;
        var DOB = (poi.dob == null || poi.dob == undefined) ? "" : poi.dob;
        var ADDRESS = (poi.address == null || poi.address == undefined) ? "" : poi.address;
        var FACIALIMAGEURL = (poi.facialImageURL == null || poi.facialImageURL == undefined) ? "" : poi.facialImageURL;
        var LICENSENUMBER = (poi.licenseNumber == null || poi.licenseNumber == undefined) ? "" : poi.licenseNumber;
        var CRIMINALHISTORYSUMMARY = (poi.criminalHistorySummary == null || poi.criminalHistorySummary == undefined) ? "" : poi.criminalHistorySummary;
        var HASWARRANTSOUTSTANDING = (poi.hasWarrantsOutstanding == null || poi.hasWarrantsOutstanding == undefined) ? "" : poi.hasWarrantsOutstanding;
        var HASFINESOUTSTANDING = (poi.hasFinesOustanding == null || poi.hasFinesOustanding == undefined) ? "" : poi.hasFinesOustanding;

        var query = `INSERT INTO POI (FNAME, LNAME, DOB, ADDRESS, FACIALIMAGEURL, LICENSENUMBER, CRIMINALHISTORYSUMMARY, HASWARRANTSOUTSTANDING, HASFINESOUTSTANDING) VALUES (:FNAME, :LNAME, :DOB, :ADDRESS, :FACIALIMAGEURL, :LICENSENUMBER, :CRIMINALHISTORYSUMMARY, :HASWARRANTSOUTSTANDING, :HASFINESOUTSTANDING)`;

        var params = [FNAME, LNAME, DOB, ADDRESS, FACIALIMAGEURL, LICENSENUMBER, CRIMINALHISTORYSUMMARY, HASWARRANTSOUTSTANDING, HASFINESOUTSTANDING];

        log("POST", "/poi", "lname is [" + LNAME + "]");

        funct.insertDataGeneric(query, params, function () {

            // Echoing result... node-oradb does not return the id, so let's temporarily return the incoming list of orders
            res.send({
                "PersonsOfInterest": poi
            });
        });
    });

    /* PUT /gpis */
    app.put('/poi/:personId', function (req, res) {


        // Retrieving Records to be inserted from path and Body:
        var personId = req.params.personId;
        var PersonOfInterest = req.body.PersonOfInterest;

        if (PersonOfInterest == null || PersonOfInterest == undefined || personId == null || personId == undefined) {
            log("PUT", "/poi/:personId", "personId or no payload data received... Please verify and try again.");
            res.status(400).end("personId or no payload data received... Please verify and try again."); //Bad request...
            return;
        }

        // Setting variables:
        var PERSONID = personId;
        var FNAME = PersonOfInterest.fname;
        var LNAME = PersonOfInterest.lname;
        var DOB = PersonOfInterest.dob;
        var ADDRESS = PersonOfInterest.address;
        var FACIALIMAGEURL = PersonOfInterest.facialImageURL;
        var LICENSENUMBER = PersonOfInterest.licenseNumber;
        var CRIMINALHISTORYSUMMARY = PersonOfInterest.criminalHistorySummary;
        var HASWARRANTSOUTSTANDING = PersonOfInterest.hasWarrantsOutstanding;
        var HASFINESOUTSTANDING = PersonOfInterest.hasFinesOustanding;
        
        var query = "UPDATE POI SET FNAME = :FNAME, LNAME = :LNAME, DOB = :DOB, ADDRESS = :ADDRESS, FACIALIMAGEURL = :FACIALIMAGEURL, LICENSENUMBER = : LICENSENUMBER, CRIMINALHISTORYSUMMARY = :CRIMINALHISTORYSUMMARY, HASWARRANTSOUTSTANDING = :HASWARRANTSOUTSTANDING, HASFINESOUTSTANDING = :HASFINESOUTSTANDING WHERE PERSONID = :PERSONID";
        
        var params = [FNAME, LNAME, DOB, ADDRESS, FACIALIMAGEURL, LICENSENUMBER, CRIMINALHISTORYSUMMARY, HASWARRANTSOUTSTANDING, HASFINESOUTSTANDING, PERSONID];

        log("PUT", "/poi/:personId", "Params are [" + JSON.stringify(params) + "]");


        funct.insertDataGeneric(query, params, function () {

            // Echoing result... node-oradb does not return the id, so let's temporarily return the incoming list of orders
            res.send({
                "PersonOfInterest": PersonOfInterest
            });
        });
    });

};
