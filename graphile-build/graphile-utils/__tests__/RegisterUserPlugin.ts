import { withPgClient } from "@dataplan/pg";
import {
  access,
  constant,
  ExecutableStep,
  list,
  object,
  ObjectStep,
  polymorphicBranch,
} from "grafast";
import { DatabaseError } from "pg";

import { gql, makeExtendSchemaPlugin } from "../src/index.js";

// Changes to this file should be reflected in `postgraphile/website/postgraphile/make-extend-schema-plugin.md`

export const RegisterUserPlugin = makeExtendSchemaPlugin((build) => {
  const { users } = build.input.pgRegistry.pgResources;
  const executor = build.input.pgRegistry.pgExecutors.main;
  return {
    typeDefs: gql`
      extend type Mutation {
        registerUser(input: RegisterUserInput!): RegisterUserPayload
      }

      input RegisterUserInput {
        username: String!
        email: String!
      }

      type RegisterUserPayload {
        result: RegisterUserResult
        query: Query
      }

      union RegisterUserResult = User | UsernameConflict | EmailAddressConflict

      type UsernameConflict {
        message: String!
        username: String!
      }

      type EmailAddressConflict {
        message: String!
        email: String!
      }
    `,
    plans: {
      Mutation: {
        registerUser(_, { $input: { $username, $email } }) {
          const $result = withPgClient(
            executor,
            list([$username, $email]),
            async (pgClient, [username, email]) => {
              try {
                return await pgClient.withTransaction(async (pgClient) => {
                  const {
                    rows: [user],
                  } = await pgClient.query<{
                    id: string;
                    username: string;
                  }>({
                    text: `
                      insert into graphile_utils_2.users (username)
                      values ($1)
                      returning *`,
                    values: [username],
                  });

                  await pgClient.query({
                    text: `
                      insert into graphile_utils_2.user_emails(user_id, email)
                      values ($1, $2)`,
                    values: [user.id, email],
                  });

                  await sendEmail(email as string, "Welcome!");

                  return { id: user.id };
                });
              } catch (e) {
                if (e instanceof DatabaseError && e.code === "23505") {
                  if (e.constraint === "unique_user_username") {
                    return {
                      __typename: "UsernameConflict",
                      message: `The username '${username}' is already in use`,
                      username,
                    };
                  } else if (e.constraint === "unique_user_email") {
                    return {
                      __typename: "EmailAddressConflict",
                      message: `The email address '${email}' is already in use`,
                      email,
                    };
                  }
                }
                throw e;
              }
            },
          );

          return object({ result: $result });
        },
      },

      RegisterUserPayload: {
        __assertStep: ObjectStep,
        result($data: ObjectStep) {
          const $result = $data.get("result");
          return polymorphicBranch($result, {
            UsernameConflict: {
              // This is a `UsernameConflict` if the object has a `__typename` property.
              match(obj) {
                return obj.__typename === "UsernameConflict";
              },
              // In this case, we can just return the object itself as the step
              // representing this polymorphic branch.
              plan($obj) {
                return $obj;
              },
            },
            EmailAddressConflict: {
              // If `match` is not specified, it defaults to checking
              // `obj.__typename === 'EmailAddressConfict'`.
              // If `plan` is not specified, it defaults to `($obj) => $obj`.
            },
            User: {
              match(obj) {
                return obj.id != null;
              },
              // In this case, we need to get the record from the database
              // associated with the given user id.
              plan($obj) {
                const $id = access($obj, "id");
                return users.get({ id: $id });
              },
            },
          });
        },
        query() {
          // The `Query` type just needs any truthy value.
          return constant(true);
        },
      },

      UsernameConflict: {
        // Since User expects a step, our types must also expect a step. We
        // don't care what the step is though.
        __assertStep: ExecutableStep,
      },
      EmailAddressConflict: {
        __assertStep: ExecutableStep,
      },
    },
  };
});

async function sendEmail(_email: string, _message: string) {
  /*
    Write your email-sending logic here. Note that we recommend you enqueue a
    job to send the email rather than sending it directly; if you don't already
    have a job queue then check out https://worker.graphile.org
  */
}
