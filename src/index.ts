import * as express from "express";
import * as bodyParser from "body-parser";
import * as http from "http";
import { query } from "./graphql";
import { IssuesResponse, Issue } from "./models";
import * as t from "io-ts";
import { openIssues, updateIssueComment } from "./queries";

function generateBody(issues: Array<Issue>): string {
  return (
    "## Feature requests\n\n" +
    " 👍votes | issue |\n" +
    ":-------:|---------|\n" +
    issues
      .sort((a, b) => b.reactions.totalCount - a.reactions.totalCount)
      .map(
        issue =>
          `${issue.reactions.totalCount} | [${issue.title}](${issue.url})`
      )
      .join("\n") +
    "\n\n<sub>last updated on " +
    new Date().toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
      timeZoneName: "short"
    }) +
    "</sub>"
  );
}

const updateFeaturesIssue = query(openIssues, {}, IssuesResponse).chain(
  ({ repository }) =>
    query(
      updateIssueComment,
      {
        // id of first comment on scalameta/metals#707
        commentId: "MDEyOklzc3VlQ29tbWVudDQ4ODMxMTQ2Ng==",
        body: generateBody(repository.issues.nodes)
      },
      t.type({})
    )
);

const app = express();

app.use(bodyParser.json());

app.post("/webhook", ({ headers }, res) => {
  const event = headers["x-github-event"];
  if (event === "issues") {
    updateFeaturesIssue.run().catch(e => console.error(e));
  }
  res.sendStatus(200);
});

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Your app is listening on port " + port));

// run at startup
updateFeaturesIssue.run().catch(e => console.error(e));
