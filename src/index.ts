import * as express from "express";
import * as bodyParser from "body-parser";
import * as http from "http";
import { query } from "./graphql";
import { IssuesResponse, Issue } from "./models";
import * as t from "io-ts";
import { openIssues, updateIssueComment } from "./queries";
import { CronJob } from "cron";
import { taskEither } from "fp-ts";
import { pipe } from "fp-ts/function";

function generateBody(issues: Array<Issue>): string {
  return (
    "## Feature requests\n\n" +
    " 👍votes | issue |\n" +
    ":-------:|---------|\n" +
    issues
      .sort((a, b) => b.reactions.totalCount - a.reactions.totalCount)
      .map(
        (issue) =>
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
      timeZoneName: "short",
    }) +
    "</sub>"
  );
}

const updateFeaturesIssue = pipe(
  query(openIssues, {}, IssuesResponse),
  taskEither.chain(({ repository }) =>
    query(
      updateIssueComment,
      {
        // id of first comment on scalameta/metals#707
        commentId: "MDEyOklzc3VlQ29tbWVudDQ4ODMxMTQ2Ng==",
        body: generateBody(repository.issues.nodes),
      },
      t.type({})
    )
  ),
  taskEither.mapLeft((e) => console.error(e))
);

const app = express();

app.use(bodyParser.json());

app.post("/webhook", ({ headers }, res) => {
  const event = headers["x-github-event"];
  if (event === "issues") {
    updateFeaturesIssue();
  }
  res.sendStatus(200);
});

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Your app is listening on port " + port));

// Run every hour, in addition to whenever we receive an issue webhook.
// This is useful to catch updates that don't generate a webhook, such
// as reactions on issues
new CronJob({
  cronTime: "0 * * * *",
  onTick: () => updateFeaturesIssue(),
  runOnInit: true,
}).start();
