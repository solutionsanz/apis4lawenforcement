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
    app.get('/officers', function (req, res) {


        var fname = req.query.fname;
        var lname = req.query.lname;
        var dob = req.query.dob;
        

        var query;
        var params = [];


        if ((fname == null || fname == undefined) && (lname == null || lname == undefined)  && (dob == null || dob == undefined)) {

            query = `SELECT * FROM OFFICERS`;

        } else if ((fname != null && fname != undefined) && (lname == null || lname == undefined) && (dob == null || dob == undefined)) {

            query = `SELECT * FROM OFFICERS WHERE FNAME = :fname`;
            params = [fname];

        } else if ((fname == null || fname == undefined) && (lname != null || lname != undefined) && (dob == null && dob == undefined)) {

            query = `SELECT * FROM OFFICERS WHERE LNAME = :lname`;
            params = [lname];

        } else if ((fname == null && fname == undefined) && (lname == null || lname == undefined) && (dob != null || dob != undefined)) {

            query = `SELECT * FROM OFFICERS WHERE DOB = :dob`;
            params = [dob];


        } else if ((fname != null || fname != undefined) && (lname != null || lname != undefined) && (dob == null && dob == undefined)) {

            query = `SELECT * FROM OFFICERS WHERE FNAME = :FNAME AND LNAME = :lname`;
            params = [fname, lname];

        } else if ((fname != null || fname != undefined) && (lname == null || lname == undefined) && (dob != null && dob != undefined)) {

            query = `SELECT * FROM OFFICERS WHERE FNAME = :FNAME AND DOB = :dob`;
            params = [fname, dob];

        } else if ((fname == null || fname == undefined) && (lname != null || lname != undefined) && (dob != null && dob != undefined)) {

            query = `SELECT * FROM OFFICERS WHERE LNAME = :LNAME AND DOB = :dob`;
            params = [lname, dob];

        } else if ((fname != null && fname != undefined) && (lname != null || lname != undefined) && (dob != null && dob != undefined)) {

            query = `SELECT * FROM OFFICERS WHERE FNAME = :FNAME AND LNAME = :LNAME AND DOB = :DOB`;
            params = [fname, lname, dob];

        } else {

            log("GET", "/officers", "Invalid logical conditions. Please verify.");
            res.status(400).end("Invalid logical conditions. Please verify."); //Bad request...
            return;
        }


        log("GET", "/officers", "Query to execute [" + query + "]");


        funct.getDataGeneric(query, params, function (resMetadata, resData) {

            log("GET", "/officers", "Found: [" + JSON.stringify({
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
                "Officers": arrResult
            });
        });
    });


    /* GET /officers/:badgeId */
    app.get('/officers/:badgeId', function (req, res) {

        var badgeId = req.params.badgeId; //gid to filter by (if given)

        var query = `SELECT * FROM OFFICERS WHERE TASKID = :badgeId`;
        var params = [];

        if (badgeId != null && badgeId != undefined) {

            params = [badgeId];

        } else {
            res.status(400).end("officer badgeId parameter empty or invalid. Verify parameters and try again."); //Bad request...
            return;
        }

        log("GET", "/officers", "badgeId received [" + badgeId + "]");


        funct.getDataGeneric(query, params, function (resMetadata, resData) {

            log("GET", "/officers", "Found: [" + JSON.stringify({
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
                "PoliceOfficer": renderedResult
            });
        });
    });

        /* PUT /officers */
        app.put('/officers/:badgeId', function (req, res) {

            // Retrieving Records to be inserted from path and Body:
            var badgeId = req.params.badgeId;
            var officer = req.body.PoliceOfficer;
    
            if (officer == null || officer == undefined || badgeId == null || badgeId == undefined) {
                log("PUT", "/officers/:badgeId", "officer badgeId or no payload data received... Please verify and try again.");
                res.status(400).end("badgeId or no payload data received... Please verify and try again."); //Bad request...
                return;
            }
    
            // Setting variables:
            var BADGEID = badgeId;
            var FNAME = officer.fname;
            var LNAME = officer.lname;
            var DOB = officer.dob;
            var ADDRESS = officer.address;
            var ADDRESS_LAT = officer.addresslat;
            var ADDRESS_LONG = officer.addresslong;
            var RANK = officer.rank;
            var ASSIGNEDTOLSA = officer.assignedtoLSA;
log("ADDRESS_LAT = ", toString(ADDRESS_LAT));
log("ADDRESS_LONG = ", toString(ADDRESS_LONG));

            var query = "UPDATE OFFICERS SET FNAME = :FNAME, LNAME = :LNAME, DOB = :DOB, ADDRESS = :ADDRESS, RANK = :RANK, ASSIGNEDTOLSA = :ASSIGNEDTOLSA, ADDRESS_LAT = :ADDRESS_LAT, ADDRESS_LONG = :ADDRESS_LONG WHERE BADGEID = :BADGEID";
    
            var params = [FNAME, LNAME, DOB, ADDRESS, RANK, ASSIGNEDTOLSA, ADDRESS_LAT, ADDRESS_LONG, BADGEID ];
    
            log("PUT", "/officers/:badgeId", "Params are [" + JSON.stringify(params) + "]");
    
    
            funct.insertDataGeneric(query, params, function () {
    
                // Echoing result... node-oradb does not return the id, so let's temporarily return the incoming list of orders
                res.send({
                    "PoliceOfficer": officer
                });
            });
        });
    
    };
