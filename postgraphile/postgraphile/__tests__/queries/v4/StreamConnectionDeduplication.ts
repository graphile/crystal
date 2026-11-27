import "graphile-config";

import type { PgSelectStep } from "@dataplan/pg";
import type { ConnectionStep } from "grafast";
import { EXPORTABLE, extendSchema, gql } from "postgraphile/utils";

const plugin = extendSchema((build) => {
  const { person: people } = build.input.pgRegistry.pgResources;
  const { connection, constant } = build.grafast;

  return {
    typeDefs: gql`
      extend type Query {
        sharedPeople: SharedPeople
      }

      type SharedPeople {
        streamed: [Person!]!
        plain: SharedPeopleConnection
      }

      type SharedPeopleConnection {
        pageInfo: PageInfo!
      }
    `,
    plans: {
      Query: {
        sharedPeople: EXPORTABLE(
          (constant, people) => () => {
            const $people = people.find();
            $people.orderBy({ attribute: "id", direction: "ASC" });
            $people.setFirst(constant(3));
            return $people;
          },
          [constant, people],
        ),
      },
      SharedPeopleConnection: {
        pageInfo: EXPORTABLE(
          () => ($connection: ConnectionStep<any>) => $connection.pageInfo(),
          [],
        ),
      },
      SharedPeople: {
        streamed: EXPORTABLE(
          (connection) => ($people: PgSelectStep) => {
            const $connection = connection($people);
            return $connection.nodes();
          },
          [connection],
        ),
        plain: EXPORTABLE(
          (connection) => ($people: PgSelectStep) => connection($people),
          [connection],
        ),
      },
    },
  };
});

export const preset: GraphileConfig.Preset = {
  plugins: [plugin],
};
