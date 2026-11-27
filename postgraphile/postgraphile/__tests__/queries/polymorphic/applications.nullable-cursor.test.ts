import { runTestQuery } from "../../helpers.ts";

test("paginates applications across null deployment dates in both directions", async () => {
  // Cursors from person 2's applications ordered by last_deployed.
  const aws2 =
    "WyJmYzc0N2M3NDAwIiwiMjAyMS0wNi0wNVQwMDowMzowMi4wMTAwMDAtMDQ6MDAiLCJBd3NBcHBsaWNhdGlvbiIsIltcIjJcIl0iXQ==";
  const gcp3 =
    "WyJmYzc0N2M3NDAwIixudWxsLCJHY3BBcHBsaWNhdGlvbiIsIltcIjNcIl0iXQ==";
  const gcp4 =
    "WyJmYzc0N2M3NDAwIixudWxsLCJHY3BBcHBsaWNhdGlvbiIsIltcIjRcIl0iXQ==";
  const { data, errors } = await runTestQuery(
    `query ($aws2: Cursor!, $gcp3: Cursor!, $gcp4: Cursor!) {
      personByPersonId(personId: 2) {
        asc: applications(orderBy: LAST_DEPLOYED_ASC) { ...page }
        ascForward: applications(orderBy: LAST_DEPLOYED_ASC, first: 3, after: $aws2) { ...page }
        ascBackward: applications(orderBy: LAST_DEPLOYED_ASC, last: 3, before: $gcp4) { ...page }
        desc: applications(orderBy: LAST_DEPLOYED_DESC) { ...page }
        descForward: applications(orderBy: LAST_DEPLOYED_DESC, first: 3, after: $gcp3) { ...page }
        descBackward: applications(orderBy: LAST_DEPLOYED_DESC, last: 3, before: $aws2) { ...page }
      }
    }
    fragment page on ApplicationsConnection {
      edges { cursor node { __typename id } }
    }`,
    {
      schema: "polymorphic",
      // A GCP application's null cursor must also match deployed AWS applications.
      setupSql: `
        update polymorphic.aws_applications set last_deployed = '2000-01-01' where last_deployed is null;
        alter table polymorphic.aws_applications alter column last_deployed set not null;
      `,
      cleanupSql:
        "alter table polymorphic.aws_applications alter column last_deployed drop not null",
      variableValues: { aws2, gcp3, gcp4 },
    },
    { path: __filename },
  );
  expect(errors).toBeFalsy();
  const { asc, ascForward, ascBackward, desc, descForward, descBackward } =
    data!.personByPersonId;
  expect(asc.edges).toHaveLength(4);
  expect(desc.edges).toHaveLength(4);
  expect(asc.edges[0].cursor).toBe(aws2);
  expect(asc.edges[3].cursor).toBe(gcp4);
  expect(desc.edges[0].cursor).toBe(gcp3);
  expect(desc.edges[3].cursor).toBe(aws2);
  expect(ascForward.edges).toEqual(asc.edges.slice(1));
  expect(ascBackward.edges).toEqual(asc.edges.slice(0, -1));
  expect(descForward.edges).toEqual(desc.edges.slice(1));
  expect(descBackward.edges).toEqual(desc.edges.slice(0, -1));
}, 60000);
