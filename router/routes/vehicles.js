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

    /* GET /vehicles */
    app.get('/vehicles', function (req, res) {

        var licensePlateNumber = req.query.licensePlateNumber;
        var registeredOwner = req.query.registeredOwner;
        var registeredOwnerAddress = req.query.registeredOwnerAddress;

        var query;
        var params = [];

        if ((licensePlateNumber == null || licensePlateNumber == undefined) && (registeredOwner == null || registeredOwner == undefined) && (registeredOwnerAddress == null || registeredOwnerAddress == undefined)) {

            query = `SELECT * FROM VEHICLES`;

        } else if ((licensePlateNumber != null && licensePlateNumber != undefined) && (registeredOwner == null || registeredOwner == undefined) && (registeredOwnerAddress == null || registeredOwnerAddress == undefined)) {

            query = `SELECT * FROM VEHICLES WHERE LICENSEPLATENUMBER = :licensePlateNumber`;
            params = [licensePlateNumber];

        } else if ((licensePlateNumber == null || licensePlateNumber == undefined) && (registeredOwner != null && registeredOwner != undefined)  && (registeredOwnerAddress == null || registeredOwnerAddress == undefined)) {

            query = `SELECT * FROM VEHICLES WHERE REGISTEREDOWNER = :registeredOwner`;
            params = [registeredOwner];

        } else if ((licensePlateNumber == null || licensePlateNumber == undefined) && (registeredOwner == null && registeredOwner == undefined)  && (registeredOwnerAddress != null || registeredOwnerAddress != undefined)) {

            query = `SELECT * FROM VEHICLES WHERE REGISTEREDOWNERADDRESS = :registeredOwnerAddress`;
            params = [registeredOwnerAddress];

        } else if ((licensePlateNumber != null && licensePlateNumber != undefined) && (registeredOwner != null && registeredOwner != undefined)  && (registeredOwnerAddress == null || registeredOwnerAddress == undefined)) {

            query = `SELECT * FROM VEHICLES WHERE LICENSEPLATENUMBER = :licensePlateNumber AND REGISTEREDOWNER = :registeredOwner`;
            params = [licensePlateNumber, registeredOwner];

        } else if ((licensePlateNumber != null && licensePlateNumber != undefined) && (registeredOwner != null && registeredOwner != undefined)  && (registeredOwnerAddress != null || registeredOwnerAddress != undefined)) {

            query = `SELECT * FROM VEHICLES WHERE LICENSEPLATENUMBER = :licensePlateNumber AND REGISTEREDOWNER = :registeredOwner AND REGISTEREDOWNERADDRESS = :registeredOwnerAddress`;
            params = [licensePlateNumber, registeredOwner, registeredOwnerAddress ];

        } else {

            log("GET", "/vehicles", "Invalid logical conditions. Please verify.");
            res.status(400).end("Invalid logical conditions. Please verify."); //Bad request...
            return;
        }


        log("GET", "/vehicles", "Query to execute [" + query + "]");


        funct.getDataGeneric(query, params, function (resMetadata, resData) {

            log("GET", "/vehicles", "Found: [" + JSON.stringify({
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
                "Vehicles": arrResult
            });
        });
    });


    /* GET /vehicles/:licenseplatenumber */
    app.get('/vehicles/:licensePlateNumber', function (req, res) {

        var l_LICENSEPLATENUMBER = req.params.licensePlateNumber; //gid to filter by (if given)

        var query = `SELECT * FROM VEHICLES WHERE LICENSEPLATENUMBER = :l_LICENSEPLATENUMBER`;
        var params = [];

        if (l_LICENSEPLATENUMBER != null && l_LICENSEPLATENUMBER != undefined) {

            params = [l_LICENSEPLATENUMBER];

        } else {
            res.status(400).end("licensePlateNumber parameter empty or invalid. Verify parameters and try again."); //Bad request...
            return;
        }

        log("GET", "/vehicles", "licensePlateNumber received [" + l_LICENSEPLATENUMBER + "]");


        funct.getDataGeneric(query, params, function (resMetadata, resData) {

            log("GET", "/vehicles", "Found: [" + JSON.stringify({
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
                "Vehicles": renderedResult
            });
        });
    });

    /* POST /tasks */
    app.post('/tasks', function (req, res) {

        // // Retrieve Records to be inserted from Body:
        var task = req.body.Task;

        if (task == null || task == undefined) {
            log("POST", "/tasks", "No data received... Please verify and try again.");
            res.status(400).end("No data received... Please verify and try again."); //Bad request...
            return;
        }

        var query = `INSERT INTO TASKS (TASKNAME, TASKDESCRIPTION, OFFICERASSIGNEDTOTASK, OFFICERASSIGNEDDATE, TASKLOCATION, TASKSTATUS, TASKLASTUPDATEDDATE, LSA, VIXENBADGEID) VALUES (:TASKNAME, :TASKDESCRIPTION, :OFFICERASSIGNEDTOTASK, :OFFICERASSIGNEDDATE, :TASKLOCATION, :TASKSTATUS, :TASKLASTUPDATEDDATE, :LSA, :VIXENBADGEID)`;

        var TASKNAME = (task.taskName == null || task.taskName == undefined) ? "Undefined" : task.taskName;
        var TASKDESCRIPTION = (task.taskDescription == null || task.taskDescription == undefined) ? "Undefined" : task.taskDescription;
        var OFFICERASSIGNEDTOTASK = (task.officerAssignedToTask == null || task.officerAssignedToTask == undefined) ? "" : task.officerAssignedToTask;
        var OFFICERASSIGNEDDATE = (task.officerAssignedDate == null || task.officerAssignedDate == undefined) ? "" : task.officerAssignedDate;
        var TASKLOCATION = (task.taskLocation == null || task.taskLocation == undefined) ? "" : task.taskLocation;
        var TASKSTATUS = (task.taskStatus == null || task.taskStatus == undefined) ? "" : task.taskStatus;
        var TASKLASTUPDATEDDATE = (task.taskLastUpdatedDate == null || task.taskLastUpdatedDate == undefined) ? "" : task.taskLastUpdatedDate;
        var LSA = (task.lsa == null || task.lsa == undefined) ? "" : task.lsa;
        var VIXENBADGEID = (task.vixenBadgeId == null || task.vixenBadgeId == undefined) ? "" : task.vixenBadgeId;
        
        var params = [TASKNAME, TASKDESCRIPTION, OFFICERASSIGNEDTOTASK, OFFICERASSIGNEDDATE, TASKLOCATION, TASKSTATUS, TASKLASTUPDATEDDATE, LSA, VIXENBADGEID];

        log("POST", "/tasks", "Taskname is [" + TASKNAME + "]");

        funct.insertDataGeneric(query, params, function () {

            // Echoing result... node-oradb does not return the id, so let's temporarily return the incoming list of orders
            res.send({
                "Task": task
            });
        });
    });

};