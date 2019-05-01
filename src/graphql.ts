import * as t from "io-ts";
import { GraphQLClient } from "graphql-request";
import { failure } from "io-ts/lib/PathReporter";
import { tryCatch, TaskEither } from "fp-ts/lib/TaskEither";
import * as taskEither from "fp-ts/lib/TaskEither";

const githubToken = process.env.GITHUB_TOKEN;

const graphqlClient = new GraphQLClient("https://api.github.com/graphql", {
  headers: {
    Authorization: `bearer ${githubToken}`
  }
});

export const query = <A>(
  query: string,
  values: Record<string, unknown>,
  responseType: t.Type<A>
): TaskEither<string, A> => {
  return tryCatch(
    () => graphqlClient.request<unknown>(query, values),
    (e: any) => {
      const error = JSON.stringify(e.message);
      console.error(
        `Github graphql API response error for query ${query}:\n`,
        error
      );
      return error;
    }
  ).chain((res: unknown) => {
    return taskEither.fromEither(responseType.decode(res)).mapLeft(errors => {
      const error = failure(errors).join("\n");
      console.error("Error while validating response type:\n", error);
      return error;
    });
  });
};
