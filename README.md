> # Deprecation note
> Currently deprecated: the only task this bot had was to publish a summary of Metals feature requests in a dedicated issue, which has now been migrated to a custom GitHub action in the https://github.com/scalameta/metals-feature-request repository.

---

# scalameta-bot

GitHub Bot to automate tasks on Scalameta projects

## Deploy

The bot is continuously deployed on Glitch, using
[`glitch-deploy`](https://github.com/glitch-tools/glitch-deploy).

The configuration for `glitch-deploy` is set as environment variables on Travis.

The GitHub token is stored directly on Glitch, in the encrypted `.env` file

> :bulb: In case the deploy fails (sometimes `glitch-deploy` doesn't work), go on https://glitch.com/edit/#!/scalameta-bot, login with the GitHub user `scalameta-bot` and manually import the GitHub project (look for the Tools menu on the bottom left)
