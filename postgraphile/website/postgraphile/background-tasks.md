---
title: Background Tasks
---

# Background Tasks in PostGraphile

In your GraphQL server typically most processing will be done in the
"foreground", as part of the request-response cycle. However, since clients
typically wait for this request cycle to complete before allowing the user to
continue to the next task, if this processing is slow (and by slow we mean
anything over a couple hundred milliseconds) it will make your application feel
sluggish and can frustrate your users. Because of this desire for low-latency
APIs, it's good practice to only perform essential calculations during the
request-response cycle, and to "queue" additional tasks for background
processing.

Examples of potential background tasks include creating PDFs, sending emails,
calling an external API that may be slow, performing big calculations, and the
like. Background tasks are also a good way of dealing with tasks where temporary
failures are expected, for example you might not be able to send an email
immediately - rather than failing the request-response cycle we can just try
again (and again, and again) over the coming seconds, minutes, and hours.
Another task you might want to solve with background tasks is running code
periodically, detached from a user action. These are all good cases for
background processing: the code runs outside of main request-response cycle,
storing the result somewhere (typically on the database) and (optionally)
notifying the client once it has finished.

Task queues are systems that enable background processing for an application.
They enable a way to persist this background processing tasks, notify the
workers and handle errors and re-tries.

### Tasks queues and workers for Postgres

There are several exisiting solutions that can integrate with a PostgreSQL
database or expose a Node.js-friendly API.

- [Graphile Worker](https://github.com/graphile/worker)
- [GCP Cloud Tasks](https://cloud.google.com/tasks/) (via Graphile Worker)
- [Faktory](http://contribsys.com/faktory/) (via Graphile Worker)
- [RabbitMQ](https://www.rabbitmq.com/)
- [pg-boss](https://www.npmjs.com/package/pg-boss)

#### Choosing your Task Queue

An important topic you will need to consider is how tasks are created in your
queue.

Since we generally recommend database-driven development, the recommend approach
is to use Graphile Worker (or Graphile Worker + another task queue through task
delegation) since you can add jobs to the queue both from inside PostgreSQL
functions (and thus triggers) and from any other source.

Other important considerations when choosing a task queue would be:

- Complexity
- Throughput requirements
- DevOps complexity
- Tracability
- Privacy

### Graphile Worker

Graphile Worker is a natural fit for a PostGraphile stack due to its
PostgreSQL-first nature. It is a simple library that runs Node.js code (or any
code Node.js can delegate to) when a task is queued within the database. Thanks
to PostgreSQL's `LISTEN/NOTIFY` pubsub features, Graphile Worker is notified
when a task is queued and can fetch, execute, and complete a trivial task in
2-3ms from when it was queued; this results in your system feeling very snappy.

Graphile Worker stores tasks into its own schema within PostgreSQL, and offers a
simple SQL API to create jobs. Queueing a job might look like:

```sql
SELECT graphile_worker.add_job('hello', json_build_object('name', 'Bobby Tables'));
```

Tasks are created in JavaScript/TypeScript, so it fits directly into your
PostGraphile stack

```js
// tasks/hello.js
module.exports = async (payload, helpers) => {
  const { name } = payload;
  helpers.logger.info(`Hello, ${name}`);
};
```

Check the [Graphile Worker docs](https://github.com/graphile/worker) for details
on how to set up and use it.

#### Limitations

Despite all the benefits, Graphile Worker stills lacks some features provided by
other more mature tasks queues

- Currently Graphile Worker doesn't expose a GUI to monitor or manage tasks.
- ??
