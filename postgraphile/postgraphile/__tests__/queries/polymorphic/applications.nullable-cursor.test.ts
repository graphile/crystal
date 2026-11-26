import { runTestQuery } from "../../helpers.ts";

test.each(["LAST_DEPLOYED_ASC", "LAST_DEPLOYED_DESC"])(
  "paginates applications across null deployment dates with %s",
  async (orderBy) => {
    // A GCP application's null cursor must also match deployed AWS applications.
    const config = {
      schema: "polymorphic",
      setupSql: `
        update polymorphic.aws_applications set last_deployed = '2000-01-01' where last_deployed is null;
        alter table polymorphic.aws_applications alter column last_deployed set not null;
      `,
      cleanupSql:
        "alter table polymorphic.aws_applications alter column last_deployed drop not null",
      variableValues: { orderBy },
    };
    const options = { path: __filename };
    const all = await runTestQuery(
      `query ($orderBy: [ApplicationsOrderBy!]) {
        personByPersonId(personId: 2) {
          applications(orderBy: $orderBy) {
            edges { cursor node { __typename id } }
          }
        }
      }`,
      config,
      options,
    );
    expect(all.errors).toBeFalsy();
    // This person owns two deployed AWS applications and two undeployed GCP applications.
    const edges = all.data!.personByPersonId.applications.edges;
    expect(edges).toHaveLength(4);

    const pages = await runTestQuery(
      `query ($orderBy: [ApplicationsOrderBy!], $after: Cursor!, $before: Cursor!) {
        personByPersonId(personId: 2) {
          forward: applications(orderBy: $orderBy, first: 3, after: $after) {
            edges { cursor node { __typename id } }
          }
          backward: applications(orderBy: $orderBy, last: 3, before: $before) {
            edges { cursor node { __typename id } }
          }
        }
      }`,
      {
        ...config,
        variableValues: {
          orderBy,
          after: edges[0].cursor,
          before: edges[3].cursor,
        },
      },
      options,
    );
    expect(pages.errors).toBeFalsy();
    expect(pages.data!.personByPersonId.forward.edges).toEqual(edges.slice(1));
    expect(pages.data!.personByPersonId.backward.edges).toEqual(
      edges.slice(0, -1),
    );
  },
);
