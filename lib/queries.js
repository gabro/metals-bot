"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openIssues = "query OpenIssues {\n  repository(owner: \"scalameta\", name: \"metals-feature-requests\") {\n    issues(filterBy: { states: OPEN }, first: 100) {\n      nodes {\n        title,\n        url\n      }\n    }\n  }\n}\n";
exports.updateIssueComment = "\nmutation UpdateIssueComment($commentId: ID!, $body: String!) {\n  updateIssueComment(input: { id: $commentId, body: $body }) {\n    clientMutationId\n  }\n}\n";
