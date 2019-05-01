import * as express from "express";
import * as bodyParser from "body-parser";
import * as http from "http";
import { query } from "./graphql";
import { IssuesResponse } from "./models";
import * as t from "io-ts";
import { openIssues, updateIssueComment } from "./queries";

const updateFeaturesIssue = query(openIssues, {}, IssuesResponse).chain(
  ({ repository }) =>
    query(
      updateIssueComment,
      {
        commentId: "MDEyOklzc3VlQ29tbWVudDQ4ODMwMjY1OQ==", // first comment of scalameta/metals#707
        body:
          "## Feature requests\n\n" +
          repository.issues.nodes
            .map(issue => `- [${issue.title}](${issue.url})`)
            .join("\n")
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
