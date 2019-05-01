"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var graphql_1 = require("./graphql");
var models_1 = require("./models");
var t = require("io-ts");
var app = express();
app.use(bodyParser.json());
// app.post("/webhook", ({ body, headers }, res) => {
//   const event = headers["x-github-event"];
// });
graphql_1.query("\n  repository(owner: \"scalameta\", name: \"metals-feature-requests\") {\n    issues(filterBy: { states: OPEN }, first: 100) {\n      nodes {\n        title,\n        url\n      }\n    }\n  }\n", {}, t.type({
    repository: t.type({
        issues: t.type({
            nodes: t.array(models_1.Issue)
        })
    })
}));
