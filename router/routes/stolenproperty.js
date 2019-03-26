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
    app.get('/stolenproperty', function (req, res) {

        var l_SEARCHCRITERIA1 = req.query.searchCriteria1;
        var l_SEARCHCRITERIA2 = req.query.searchCriteria2;
        var l_SEARCHCRITERIA3 = req.query.searchCriteria3;

        log("After var set - searchCriteria1", "/stolenproperty", "Query to execute [" + l_SEARCHCRITERIA1 + "]");
        log("After var set - searchCriteria2", "/stolenproperty", "Query to execute [" + l_SEARCHCRITERIA2 + "]");
        log("After var set - searchCriteria3", "/stolenproperty", "Query to execute [" + l_SEARCHCRITERIA3 + "]");

        var query;
        var params = [];

        if ((l_SEARCHCRITERIA1 == null || l_SEARCHCRITERIA1 == undefined) && (l_SEARCHCRITERIA2 == null || l_SEARCHCRITERIA2 == undefined) && (l_SEARCHCRITERIA3 == null || l_SEARCHCRITERIA3 == undefined)) {

            query = `SELECT * FROM STOLEN_PROPERTY`;
        
        } else if ((l_SEARCHCRITERIA1 != null || l_SEARCHCRITERIA1 != undefined) && (l_SEARCHCRITERIA2 == null || l_SEARCHCRITERIA2 == undefined) && (l_SEARCHCRITERIA3 == null || l_SEARCHCRITERIA3 == undefined)) {

            l_SEARCHCRITERIA1 = '%' + l_SEARCHCRITERIA1 + '%';
            log("searchCriteria1", "/stolenproperty", "Query to execute [ " + l_SEARCHCRITERIA1 + " ]");

            query = `SELECT * FROM STOLEN_PROPERTY WHERE ITEMDESCRIPTION LIKE :searchCriteria1`;
            params = [l_SEARCHCRITERIA1];

        } else if ((l_SEARCHCRITERIA1 == null || l_SEARCHCRITERIA1 == undefined) && (l_SEARCHCRITERIA2 != null || l_SEARCHCRITERIA2 != undefined) && (l_SEARCHCRITERIA3 == null || l_SEARCHCRITERIA3 == undefined)) {

            l_SEARCHCRITERIA2 = '%' + l_SEARCHCRITERIA2 + '%';
            log("searchCriteria2", "/stolenproperty", "Query to execute [ " + l_SEARCHCRITERIA2 + " ]");

            query = `SELECT * FROM STOLEN_PROPERTY WHERE ITEMDESCRIPTION LIKE :searchCriteria2`;
            params = [l_SEARCHCRITERIA2];

        } else if ((l_SEARCHCRITERIA1 == null || l_SEARCHCRITERIA1 == undefined) && (l_SEARCHCRITERIA2 == null || l_SEARCHCRITERIA2 == undefined) && (l_SEARCHCRITERIA3 != null || l_SEARCHCRITERIA3 != undefined)) {

            l_SEARCHCRITERIA3 = '%' + l_SEARCHCRITERIA3 + '%';
            log("searchCriteria3", "/stolenproperty", "Query to execute [ " + l_SEARCHCRITERIA3 + " ]");

            query = `SELECT * FROM STOLEN_PROPERTY WHERE ITEMDESCRIPTION LIKE :searchCriteria3`;
            params = [l_SEARCHCRITERIA3];

         } else if ((l_SEARCHCRITERIA1 != null || l_SEARCHCRITERIA1 != undefined) && (l_SEARCHCRITERIA2 != null || l_SEARCHCRITERIA2 != undefined) && (l_SEARCHCRITERIA3 == null || l_SEARCHCRITERIA3 == undefined)) {

            l_SEARCHCRITERIA1 = '%' + l_SEARCHCRITERIA1 + '%';
            l_SEARCHCRITERIA2 = '%' + l_SEARCHCRITERIA2 + '%';
            log("searchCriteria1", "/stolenproperty", "Query to execute [ " + l_SEARCHCRITERIA1 + " ]");
            log("searchCriteria2", "/stolenproperty", "Query to execute [ " + l_SEARCHCRITERIA2 + " ]");

            query = `SELECT * FROM STOLEN_PROPERTY WHERE ITEMDESCRIPTION LIKE :searchCriteria1 AND ITEMDESCRIPTION LIKE :searchCriteria2`;
            params = [l_SEARCHCRITERIA1, l_SEARCHCRITERIA2];

        } else if ((l_SEARCHCRITERIA1 != null || l_SEARCHCRITERIA1 != undefined) && (l_SEARCHCRITERIA2 == null || l_SEARCHCRITERIA2 == undefined) && (l_SEARCHCRITERIA3 != null || l_SEARCHCRITERIA3 != undefined)) {

            l_SEARCHCRITERIA1 = '%' + l_SEARCHCRITERIA1 + '%';
            l_SEARCHCRITERIA3 = '%' + l_SEARCHCRITERIA3 + '%';  
            log("searchCriteria1", "/stolenproperty", "Query to execute [ " + l_SEARCHCRITERIA1 + " ]");
            log("searchCriteria3", "/stolenproperty", "Query to execute [ " + l_SEARCHCRITERIA3 + " ]");

            query = `SELECT * FROM STOLEN_PROPERTY WHERE ITEMDESCRIPTION LIKE :searchCriteria1 AND ITEMDESCRIPTION LIKE :searchCriteria2`;
            params = [l_SEARCHCRITERIA1, l_SEARCHCRITERIA3];

        } else if ((l_SEARCHCRITERIA1 == null || l_SEARCHCRITERIA1 == undefined) && (l_SEARCHCRITERIA2 != null || l_SEARCHCRITERIA2 != undefined) && (l_SEARCHCRITERIA3 != null || l_SEARCHCRITERIA3 != undefined)) {

            l_SEARCHCRITERIA2 = '%' + l_SEARCHCRITERIA2 + '%';
            l_SEARCHCRITERIA3 = '%' + l_SEARCHCRITERIA3 + '%';
            log("searchCriteria2", "/stolenproperty", "Query to execute [ " + l_SEARCHCRITERIA2 + " ]");
            log("searchCriteria3", "/stolenproperty", "Query to execute [ " + l_SEARCHCRITERIA3 + " ]");

            query = `SELECT * FROM STOLEN_PROPERTY WHERE ITEMDESCRIPTION LIKE :searchCriteria1 AND ITEMDESCRIPTION LIKE :searchCriteria2`;
            params = [l_SEARCHCRITERIA2, l_SEARCHCRITERIA3];

        } else if ((l_SEARCHCRITERIA1 != null || l_SEARCHCRITERIA1 != undefined) && (l_SEARCHCRITERIA2 != null || l_SEARCHCRITERIA2 != undefined) && (l_SEARCHCRITERIA3 != null || l_SEARCHCRITERIA3 != undefined)) {

            l_SEARCHCRITERIA1 = '%' + l_SEARCHCRITERIA1 + '%';
            l_SEARCHCRITERIA2 = '%' + l_SEARCHCRITERIA2 + '%';
            l_SEARCHCRITERIA3 = '%' + l_SEARCHCRITERIA3 + '%';

            log("searchCriteria1", "/stolenproperty", "Query to execute [ " + l_SEARCHCRITERIA1 + " ]");
            log("searchCriteria2", "/stolenproperty", "Query to execute [ " + l_SEARCHCRITERIA2 + " ]");
            log("searchCriteria3", "/stolenproperty", "Query to execute [ " + l_SEARCHCRITERIA3 + " ]");

            query = `SELECT * FROM STOLEN_PROPERTY WHERE ITEMDESCRIPTION LIKE :searchCriteria1 AND ITEMDESCRIPTION LIKE :searchCriteria2 AND ITEMDESCRIPTION LIKE :searchCriteria3`;
            params = [l_SEARCHCRITERIA1, l_SEARCHCRITERIA2, l_SEARCHCRITERIA3];

        } else {

            log("GET", "/stolenproperty", "Invalid logical conditions. Please verify.");
            res.status(400).end("Invalid logical conditions. Please verify."); //Bad request...
            return;
        }


        log("GET", "/stolenproperty", "Query to execute [" + query + "]");


        funct.getDataGeneric(query, params, function (resMetadata, resData) {

            log("GET", "/stolenproperty", "Found: [" + JSON.stringify({
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
                "StolenProperty": arrResult
            });
        });
    });

    /* GET /stolenproperty/:itemId */
    app.get('/stolenproperty/:itemId', function (req, res) {

        var l_ITEMID = req.params.itemId; //gid to filter by (if given)

        var query = `SELECT * FROM STOLEN_PROPERTY WHERE ITEMID = :itemId`;
        var params = [];

        if (l_ITEMID != null && l_ITEMID != undefined) {

            params = [l_ITEMID];

        } else {
            res.status(400).end("gid parameter empty or invalid. Verify parameters and try again."); //Bad request...
            return;
        }

        log("GET", "/stolenproperty", "itemId received [" + l_ITEMID + "]");


        funct.getDataGeneric(query, params, function (resMetadata, resData) {

            log("GET", "/stolenproperty", "Found: [" + JSON.stringify({
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
                "StolenProperty": renderedResult
            });
        });
    });

    /* POST /stolenproperty */
    app.post('/stolenproperty', function (req, res) {

        // // Retrieve Records to be inserted from Body:
        var l_stolenproperty = req.body.StolenProperty;

        if (l_stolenproperty == null || l_stolenproperty == undefined) {
            log("POST", "/stolenproperty", "No data received... Please verify and try again.");
            res.status(400).end("No data received... Please verify and try again."); //Bad request...
            return;
        }

        var query = `INSERT INTO STOLENPROPERTY (ITEMNAME,ITEMDESCRIPTION,ITEMIMAGEURL,ITEMOWNER,ITEMADDRESS,ITEMADDRESS_LAT,ITEMADDRESS_LONG) VALUES (l_ITEMNAME, l_ITEMDESCRIPTION, l_ITEMIMAGEURL, l_ITEMOWNER, l_ITEMADDRESS, l_ITEMADDRESS_LAT, l_ITEMADDRESS_LONG)`;

        var l_ITEMNAME = (l_stolenproperty.taskName == null || l_stolenproperty.taskName == undefined) ? "Undefined" : l_stolenproperty.taskName;
        var l_ITEMDESCRIPTION = (l_stolenproperty.taskDescription == null || l_stolenproperty.taskDescription == undefined) ? "Undefined" : l_stolenproperty.taskDescription;
        var l_ITEMIMAGEURL = (l_stolenproperty.officerAssignedToTask == null || l_stolenproperty.officerAssignedToTask == undefined) ? "" : l_stolenproperty.officerAssignedToTask;
        var l_ITEMOWNER = (l_stolenproperty.officerAssignedDate == null || l_stolenproperty.officerAssignedDate == undefined) ? "" : l_stolenproperty.officerAssignedDate;
        var l_ITEMADDRESS = (l_stolenproperty.taskLocation == null || l_stolenproperty.taskLocation == undefined) ? "" : l_stolenproperty.taskLocation;
        var l_ITEMADDRESS_LAT = (l_stolenproperty.taskStatus == null || l_stolenproperty.taskStatus == undefined) ? "" : l_stolenproperty.taskStatus;
        var l_ITEMADDRESS_LONG = (l_stolenproperty.taskLastUpdatedDate == null || l_stolenproperty.taskLastUpdatedDate == undefined) ? "" : l_stolenproperty.taskLastUpdatedDate;
        
        var params = [l_ITEMNAME, l_ITEMDESCRIPTION, l_ITEMIMAGEURL, l_ITEMOWNER, l_ITEMADDRESS, l_ITEMADDRESS_LAT, l_ITEMADDRESS_LONG];

        log("POST", "/stolenproperty", "ItemName is [" + ITEMNAME + "]");

        funct.insertDataGeneric(query, params, function () {

            // Echoing result... node-oradb does not return the id, so let's temporarily return the incoming list of orders
            res.send({
                "StolenProperty": l_stolenproperty
            });
        });
    });

};