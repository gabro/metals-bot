"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_request_1 = require("graphql-request");
var PathReporter_1 = require("io-ts/lib/PathReporter");
var TaskEither_1 = require("fp-ts/lib/TaskEither");
var taskEither = require("fp-ts/lib/TaskEither");
var githubToken = process.env.GITHUB_TOKEN;
var graphqlClient = new graphql_request_1.GraphQLClient("https://api.github.com/graphql", {
    headers: {
        Authorization: "bearer " + githubToken
    }
});
exports.query = function (query, values, responseType) {
    return TaskEither_1.tryCatch(function () { return graphqlClient.request(query, values); }, function (e) {
        var error = JSON.stringify(e.message);
        console.error("Github graphql API response error for query " + query + ":\n", error);
        return error;
    }).chain(function (res) {
        return taskEither.fromEither(responseType.decode(res)).mapLeft(function (errors) {
            var error = PathReporter_1.failure(errors).join("\n");
            console.error("Error while validating response type:\n", error);
            return error;
        });
    });
};
