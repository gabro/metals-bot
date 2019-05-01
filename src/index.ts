import * as express from "express";
import * as bodyParser from "body-parser";
import { query } from "./graphql";
import { IssuesResponse } from "./models";
import * as t from "io-ts";
import { openIssues, updateIssueComment } from "./queries";

const app = express();

app.use(bodyParser.json());

app.post("/webhook", ({ headers }, res) => {
  const event = headers["x-github-event"];
  if (event === "issues") {
    updateFeaturesIssue.run().catch(e => console.error(e));
  }
  res.sendStatus(200);
});

app.listen(3002);

const updateFeaturesIssue = query(openIssues, {}, IssuesResponse).chain(
  ({ repository }) =>
    query(
      updateIssueComment,
      {
        commentId: "MDEyOklzc3VlQ29tbWVudDQ4ODI0NjI2OA==",
        body:
          "## Feature requests\n\n" +
          repository.issues.nodes
            .map(issue => `- [${issue.title}](${issue.url})`)
            .join("\n")
      },
      t.type({})
    )
);
