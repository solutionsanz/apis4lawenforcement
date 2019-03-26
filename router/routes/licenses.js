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

    /* GET /licenses */
    app.get('/licenses', function (req, res) {


        var fname = req.query.firstName;
        var lname = req.query.lastName;
        var dob = req.query.dateOfBirth;

        var query;
        var params = [];

        if ((fname == null || fname == undefined) && (lname == null || lname == undefined) && (dob == null || dob == undefined)) {

            query = `SELECT * FROM LICENSES`;

        } else if ((fname != null && fname != undefined) && (lname == null || lname == undefined) && (dob == null || dob == undefined)) {

            query = `SELECT * FROM LICENSES WHERE FNAME = :fname`;
            params = [fname];

        } else if ((fname == null || fname == undefined) && (lname != null || lname != undefined) && (dob == null && dob == undefined)) {

            query = `SELECT * FROM LICENSES WHERE LNAME = :lname`;
            params = [lname];

        } else if ((fname == null || fname == undefined) && (lname == null || lname == undefined) && (dob != null && dob != undefined)) {

            query = `SELECT * FROM LICENSES WHERE DOB = :dob`;
            params = [dob];

        } else if ((fname != null && fname != undefined) && (lname != null || lname != undefined) && (dob != null && dob != undefined)) {

            query = `SELECT * FROM LICENSES WHERE FNAME = :fname AND LNAME = :lname AND DOB = :dob`;
            params = [fname, lname, dob];

        } else if ((fname == null && fname == undefined) && (lname != null || lname != undefined) && (dob != null && dob != undefined)) {

            query = `SELECT * FROM LICENSES WHERE LNAME = :lname AND DOB = :dob`;
            params = [lname, dob];

        } else if ((fname != null && fname != undefined) && (lname == null || lname == undefined) && (dob != null && dob != undefined)) {

            query = `SELECT * FROM LICENSES WHERE FNAME = :fname AND DOB = :dob`;
            params = [fname, dob];

        } else {

            log("GET", "/licenses", "Invalid logical conditions. Please verify.");
            res.status(400).end("Invalid logical conditions. Please verify."); //Bad request...
            return;
        }


        log("GET", "/licenses", "Query to execute [" + query + "]");


        funct.getDataGeneric(query, params, function (resMetadata, resData) {

            log("GET", "/licenses", "Found: [" + JSON.stringify({
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
                "Licenses": arrResult
            });
        });
    });


    /* GET /licenses/:licensePlateNumber */
    app.get('/licenses/:licensePlateNumber', function (req, res) {

        var l_licensePlateNumber = req.params.licensePlateNumber; //gid to filter by (if given)

        var query = `SELECT * FROM LICENSES WHERE LICENSENUMBER = :licensePlateNumber`;
        var params = [];

        if (l_licensePlateNumber != null && l_licensePlateNumber != undefined) {

            params = [l_licensePlateNumber];

        } else {
            res.status(400).end("licensePlateNumber parameter empty or invalid. Verify parameters and try again."); //Bad request...
            return;
        }

        log("GET", "/licenses", "licensePlateNumber received [" + l_licensePlateNumber + "]");


        funct.getDataGeneric(query, params, function (resMetadata, resData) {

            log("GET", "/licenses", "Found: [" + JSON.stringify({
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
                "Licenses": renderedResult
            });
        });
    });

    /* POST /tasks */
    app.post('/licenses', function (req, res) {

        // // Retrieve Records to be inserted from Body:
        var l_LICENSES = req.body.Licenses;

        if (l_LICENSES == null || l_LICENSES == undefined) {
            log("POST", "/licenses", "No data received... Please verify and try again.");
            res.status(400).end("No data received... Please verify and try again."); //Bad request...
            return;
        }

        var query = `INSERT INTO LICENSES (LICENSE_NUMBER,LICENSE_CLASS,LICENSEEXPIRYDATE,FNAME,LNAME,DOB,ADDRESS,ADDRESS_LAT,ADDRESS_LONG) VALUES (:l_LICENSENUMBER,:l_LICENSECLASS,:l_LICENSEEXPIRYDATE,:l_FNAME,:l_LNAME,:l_DOB,:l_ADDRESS,:l_ADDRESS_LAT,:l_ADDRESS_LONG)`;

        var l_LICENSENUMBER = (l_LICENSES.licenseNumber == null || l_LICENSES.licenseNumber == undefined) ? "Undefined" : l_LICENSES.licenseNumber;
        var l_LICENSECLASS = (l_LICENSES.licenseClass == null || l_LICENSES.licenseClass == undefined) ? "Undefined" : l_LICENSES.licenseClass;
        var l_LICENSEEXPIRYDATE = (l_LICENSES.licenseExpiryDate == null || l_LICENSES.licenseExpiryDate == undefined) ? "" : l_LICENSES.licenseExpiryDate;
        var l_FNAME = (l_LICENSES.fname == null || l_LICENSES.fname == undefined) ? "" : l_LICENSES.fname;
        var l_LNAME = (l_LICENSES.lname == null || l_LICENSES.lname == undefined) ? "" : l_LICENSES.lname;
        var l_DOB = (l_LICENSES.dob == null || l_LICENSES.dob == undefined) ? "" : l_LICENSES.dob;
        var l_ADDRESS = (l_LICENSES.address == null || l_LICENSES.address == undefined) ? "" : l_LICENSES.address;
        var l_ADDRESS_LAT = (l_LICENSES.address_lat == null || l_LICENSES.address_lat == undefined) ? "" : l_LICENSES.address_lat;
        var l_ADDRESS_LONG = (l_LICENSES.address_long == null || l_LICENSES.address_long == undefined) ? "" : l_LICENSES.address_long;
        
        var params = [l_LICENSENUMBER,l_LICENSECLASS,l_LICENSEEXPIRYDATE,l_FNAME,l_LNAME,l_DOB,l_ADDRESS,l_ADDRESS_LAT,l_ADDRESS_LONG];

        log("POST", "/licenses", "License Number is [" + l_LICENSE_NUMBER + "]");

        funct.insertDataGeneric(query, params, function () {

            // Echoing result... node-oradb does not return the id, so let's temporarily return the incoming list of orders
            res.send({
                "Licenses": l_LICENSES
            });
        });
    });

};