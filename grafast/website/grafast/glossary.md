---
sidebar_position: 999999998
---

:::info[Work in progress]

Feel free to add more terms and/or definitions via pull requests!

:::

# Glossary

## `step`

A particular action or transform performed as part of executing a _GraphQL
request_. An instance of a [step class](#step-class). Each step belongs to
exactly one [layer plan](#layer-plan).

## Step class

The backing logic of a step, see [step classes](./step-classes.mdx).

## Operation plan

The combination of an _execution plan_ and _output plan_ that details how to
execute and output the result of a _GraphQL request_.

## Execution plan

A directed acyclic graph of steps that detail the execution of a GraphQL
request, part of the [operation plan](#operation-plan). Also details the [layer
plans](#layer-plan) within, and their relationships.

## Output plan

Details how to take data from the [steps](#step) executed as part of the
[execution plan](#execution-plan) for an individual _GraphQL request_ and format
them into a valid _GraphQL response_.

## Layer plan

## Bucket

## Plan diagram

## Execution

## Planning

## Life-cycle

## Optimize

## Finalize

## Plan resolver

## Traditional resolver

## GraphQL request

As defined in the GraphQL spec as ["a request for
execution"](https://spec.graphql.org/draft/#request).

- `schema` - the GraphQL schema
- `document` - the GraphQL [document](#document)

## GraphQL response

As [defined in the GraphQL spec](https://spec.graphql.org/draft/#sec-Response).

## (GraphQL) document

## (GraphQL) operation

## (GraphQL) query

## (GraphQL) mutation

## (GraphQL) subscription
