"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var http = require("http");
var graphql_1 = require("./graphql");
var models_1 = require("./models");
var t = require("io-ts");
var queries_1 = require("./queries");
var app = express();
app.use(bodyParser.json());
app.post("/webhook", function (_a, res) {
    var headers = _a.headers;
    var event = headers["x-github-event"];
    if (event === "issues") {
        updateFeaturesIssue.run().catch(function (e) { return console.error(e); });
    }
    res.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(function () {
    http.get("http://" + process.env.PROJECT_DOMAIN + ".glitch.me/");
}, 280000);
var updateFeaturesIssue = graphql_1.query(queries_1.openIssues, {}, models_1.IssuesResponse).chain(function (_a) {
    var repository = _a.repository;
    return graphql_1.query(queries_1.updateIssueComment, {
        commentId: "MDEyOklzc3VlQ29tbWVudDQ4ODI0NjI2OA==",
        body: "## Feature requests\n\n" +
            repository.issues.nodes
                .map(function (issue) { return "- [" + issue.title + "](" + issue.url + ")"; })
                .join("\n")
    }, t.type({}));
});
