---
title: Deploying to Heroku
---

:::caution

This documentation is copied from Version 4 and has not been updated to Version
5 yet; it may not be valid.

:::

It's possible to use PostGraphile on Heroku with either AWS RDS or Heroku
Postgres.

### AWS RDS

We recommend using an Amazon RDS PostgreSQL database with Heroku since Heroku
Postgres does not allow the issue of `CREATE ROLE` commands. (This can be worked
around, see below.)

You should enable the `force_ssl` setting in RDS, and to ensure PostGraphile
connects to RDS using SSL you need to add `?ssl=true` to the connection string,
e.g.
`heroku config:set DATABASE_URL="postgres://...rdshost.../db_name?ssl=true"`

### Heroku Postgres

It is also possible to use PostGraphile with Heroku Postgres too with a bit more
setup (and money!).

1. Create a database if not already. The database must be of the Standard-0 tier
   (\$50/month) or higher, otherwise you will not be able to create additional
   credentials.
2. Create credentials on https://data.heroku.com for each Postgres role that you
   wish to use. For example, create a credential for `postgraphile` (which your
   app will use to log in with) and `postgraphile_visitor` (which PostGraphile
   should switch into for each request).
3. Attach the `postgraphile` credential to your app, so that there should now be
   two credentials attached to your app (`default` and `postgraphile`).
4. Use the `POSTGRAPHILE` environment variable instead of `DATABASE_URL` in your
   app's code to connect to Postgres with this credential.
5. Don't forget to use SSL too (e.g. with the env var `PGSSLMODE=require`)!

See: https://devcenter.heroku.com/articles/heroku-postgresql-credentials

### Minimal setup, using PostGraphile CLI

1. Create a project directory `mkdir project_folder_name`
2. Go into that directory and initialise git:
   `cd project_folder_name && git init`
3. Add postgraphile: `yarn add postgraphile`
4. Commit everything: `git add . && git commit -m "Initial commit"`
5. Add the heroku remote `heroku git:remote -a heroku_app_name`
6. Configure Heroku to use the right url
   `heroku config:set RDS_URL="postgres://user:pass@rdshost/dbname?ssl=true" -a heroku_app_name`
7. Create Procfile:
   `echo 'web: postgraphile -c $RDS_URL --host 0.0.0.0 --port $PORT' >> Procfile`
8. Deploy: `git push heroku master`

### More detailed setup, using PostGraphile as a library

This walkthrough assumes you have a local git repository containing your
project.

First, you need to create a `Procfile` file in the root of your repo, telling
Heroku what to run:

```
web: yarn start
```

You may also want to ensure that your `package.json` contains a `build` script
that builds your app (e.g. calling `tsc` if you're using TypeScript), and that
you have `engines` defined to tell Heroku which version of Node to use:

```json
  "scripts": {
    "build": "tsc",
    "start": "node server.js",
  },
  "engines": {
    "node": "12.x"
  }
```

Commit all this.

Once your database server is running and the database and relevant roles have
been created, you need to do the following (note: many of these commands can
instead be accomplished with the Heroku web interface):

- [Create the Heroku app](https://devcenter.heroku.com/articles/creating-apps)
  e.g. `heroku create myappname`
- [Set Heroku config variables](https://devcenter.heroku.com/articles/config-vars)
  e.g.
  ```bash
  heroku config:set \
      NODE_ENV="production" \
      GRAPHILE_TURBO="1" \
      DATABASE_URL="postgres://username:password@host:port/dbname?ssl=true" \
      -a myappname
  ```
- Add the Heroku app as a git remote to your local repository, e.g.
  `git remote add heroku git@heroku.com:myappname.git` (make sure you've
  [uploaded your SSH key to Heroku](https://devcenter.heroku.com/articles/keys))
- Push the `master` branch from your repo to Heroku to perform your initial
  build: `git push heroku master`

You should see the build scrolling past; if it fails then you should be able to
see why and address it. If it succeeds then your application should be available
at `https://<myappname>.herokuapp.com`

For a more in-depth and automated setup, including instructions on configuring a
job queue and sending emails, see the
[Deploying to Heroku instructions in Graphile Starter](https://github.com/graphile/starter#deploying-to-heroku).

### Cleanup

To delete the Heroku app:

```
heroku apps:destroy -a myappname
```
