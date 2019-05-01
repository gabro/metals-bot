"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var t = require("io-ts");
exports.Issue = t.type({
    title: t.string,
    url: t.string
}, "Issue");
exports.IssuesResponse = t.type({
    repository: t.type({
        issues: t.type({
            nodes: t.array(exports.Issue)
        })
    })
}, "IssuesResponse");
