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
    app.get('/tasks', function (req, res) {


        var badgeId = req.query.badgeId;
        var lsa = req.query.lsa;


        var query;
        var params = [];

        if ((badgeId == null || badgeId == undefined) && (lsa == null || lsa == undefined)) {

            query = `SELECT * FROM TASKS`;

        } else if ((badgeId != null && badgeId != undefined) && (lsa == null || lsa == undefined)) {

            query = `SELECT * FROM TASKS WHERE OFFICERASSIGNEDTOTASK = :badgeId`;
            params = [badgeId];

        } else if ((badgeId == null || badgeId == undefined) && (lsa != null && lsa != undefined)) {

            query = `SELECT * FROM TASKS WHERE LSA = :lsa`;
            params = [lsa];

        } else if ((badgeId != null && badgeId != undefined) && (lsa != null && lsa != undefined)) {

            query = `SELECT * FROM TASKS WHERE OFFICERASSIGNEDTOTASK = :badgeId AND LSA = :lsa`;
            params = [badgeId, lsa];

        } else {

            log("GET", "/tasks", "Invalid logical conditions. Please verify.");
            res.status(400).end("Invalid logical conditions. Please verify."); //Bad request...
            return;
        }


        log("GET", "/tasks", "Query to execute [" + query + "]");


        funct.getDataGeneric(query, params, function (resMetadata, resData) {

            log("GET", "/tasks", "Found: [" + JSON.stringify({
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
                "Tasks": arrResult
            });
        });
    });


    /* GET /tasks/:taskid */
    app.get('/tasks/:taskid', function (req, res) {

        var taskid = req.params.taskid; //gid to filter by (if given)

        var query = `SELECT * FROM TASKS WHERE TASKID = :taskid`;
        var params = [];

        if (taskid != null && taskid != undefined) {

            params = [taskid];

        } else {
            res.status(400).end("gid parameter empty or invalid. Verify parameters and try again."); //Bad request...
            return;
        }

        log("GET", "/tasks", "taskid received [" + taskid + "]");


        funct.getDataGeneric(query, params, function (resMetadata, resData) {

            log("GET", "/tasks", "Found: [" + JSON.stringify({
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
                "Task": renderedResult
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

    /* PUT /tasks */
    app.put('/tasks/:taskId', function (req, res) {

        // Retrieving Records to be inserted from path and Body:
        var taskId = req.params.taskId;
        var task = req.body.Task;

        if (task == null || task == undefined || taskId == null || taskId == undefined) {
            log("PUT", "/tasks/:taskId", "taskId or no payload data received... Please verify and try again.");
            res.status(400).end("taskId or no payload data received... Please verify and try again."); //Bad request...
            return;
        }

        // Setting variables:
        var TASKID = taskId;
        var TASKNAME = task.taskName;
        var TASKDESCRIPTION = task.taskDescription;
        var OFFICERASSIGNEDTOTASK = task.officerAssignedToTask;
        var OFFICERASSIGNEDDATE = task.officerAssignedDate;
        var TASKLOCATION = task.taskLocation;
        var TASKSTATUS = task.taskStatus;
        var TASKLASTUPDATEDDATE = task.taskLastUpdatedDate;
        var LSA = task.lsa;
        var VIXENBADGEID = task.vixenBadgeId;

        var query = "UPDATE TASKS SET TASKNAME = :TASKNAME, TASKDESCRIPTION = :TASKDESCRIPTION, OFFICERASSIGNEDTOTASK = :OFFICERASSIGNEDTOTASK, OFFICERASSIGNEDDATE = :OFFICERASSIGNEDDATE, TASKLOCATION = :TASKLOCATION, TASKSTATUS = :TASKSTATUS, TASKLASTUPDATEDDATE = :TASKLASTUPDATEDDATE, LSA = :LSA, VIXENBADGEID = :VIXENBADGEID WHERE TASKID = :TASKID";

        var params = [TASKNAME, TASKDESCRIPTION, OFFICERASSIGNEDTOTASK, OFFICERASSIGNEDDATE, TASKLOCATION, TASKSTATUS, TASKLASTUPDATEDDATE, LSA, VIXENBADGEID, TASKID ];

        log("PUT", "/tasks/:taskId", "Params are [" + JSON.stringify(params) + "]");


        funct.insertDataGeneric(query, params, function () {

            // Echoing result... node-oradb does not return the id, so let's temporarily return the incoming list of orders
            res.send({
                "Tasks": task
            });
        });
    });

};
