import { ConnectionStep, ObjectStep, Step } from "grafast";
import { listOfCodec, TYPES } from "postgraphile/@dataplan/pg";
import { sql } from "postgraphile/pg-sql2";
import { EXPORTABLE, extendSchema, gql } from "postgraphile/utils";

const DEFAULT_PAGE_SIZE = 24;

const LOOKUP: Record<string, string | undefined> = {
  movie: "MovieCollection",
  series: "SeriesCollection",
};
const recommendationTypeNameFromType = EXPORTABLE(
  (LOOKUP) =>
    function recommendationTypeNameFromType(type: unknown): string | null {
      return LOOKUP[String(type)] ?? null;
    },
  [LOOKUP],
);

const extensionsPlugin = extendSchema((build) => {
  const {
    EXPORTABLE,
    input: { pgRegistry },
    grafast: { object, constant, get, connection, lambda, coalesce },
  } = build;
  const { collections } = pgRegistry.pgResources;

  return {
    typeDefs: gql`
      input Pagination {
        first: Int
        after: String
      }

      input ContentInput {
        pagination: Pagination!
      }

      interface RecommendationItem {
        id: String!
      }

      extend type MovieCollection implements RecommendationItem
      extend type SeriesCollection implements RecommendationItem

      type Recommendation {
        clusterId: String
        items: [RecommendationItem!]
        pageInfo: PageInfo
      }

      extend type Query {
        collectionRecommendation(
          collectionId: String!
          input: ContentInput!
        ): Recommendation!
      }
    `,
    interfaces: {
      RecommendationItem: {
        planType: EXPORTABLE(
          (get, lambda, recommendationTypeNameFromType) =>
            function planType(
              $specifier: Step<{ id: string; type: string }>,
              _info,
            ) {
              const $type = get($specifier, "type");
              const $__typename = lambda(
                $type,
                recommendationTypeNameFromType,
                true,
              );

              return {
                $__typename,
                // Implementing this would make the test much more efficient:
                // planForType() {
                //   return (
                //     _info.$original ?? collections.get({ id: get($specifier, "id") })
                //   );
                // },
              };
            },
          [get, lambda, recommendationTypeNameFromType],
        ),
      },
    },
    objects: {
      Query: {
        plans: {
          collectionRecommendation: EXPORTABLE(
            (
              DEFAULT_PAGE_SIZE,
              TYPES,
              coalesce,
              collections,
              connection,
              constant,
              get,
              lambda,
              listOfCodec,
              object,
              sql,
              uniq,
            ) =>
              function collectionRecommendation(
                _,
                { $collectionId, $input: { $pagination } },
              ) {
                const $collection = collections.get({ id: $collectionId });
                const $items = get(
                  get($collection, "recommendations"),
                  "items",
                );
                const $uniqItems = lambda($items, uniq, true);

                const $list = collections.find();
                const textArray = listOfCodec(TYPES.text);
                const sqlUniqIds = $list.placeholder($uniqItems, textArray);
                $list.where(sql`${$list.alias}.id = ANY(${sqlUniqIds})`);

                const $conn = connection($list);
                $conn.setFirst(
                  coalesce(
                    get($pagination, "first"),
                    constant(DEFAULT_PAGE_SIZE),
                  ),
                );
                $conn.setAfter(get($pagination, "after"));

                return object({ clusterId: constant(""), __conn: $conn });
              },
            [
              DEFAULT_PAGE_SIZE,
              TYPES,
              coalesce,
              collections,
              connection,
              constant,
              get,
              lambda,
              listOfCodec,
              object,
              sql,
              uniq,
            ],
          ),
        },
      },
      Recommendation: {
        plans: {
          items: EXPORTABLE(
            (get) =>
              function items(
                $parent: ObjectStep<{ __conn: ConnectionStep<any> }>,
              ) {
                const $connection = get($parent, "__conn");
                return $connection.nodes();
              },
            [get],
          ),
          pageInfo: EXPORTABLE(
            (get) =>
              function pageInfo(
                $parent: ObjectStep<{ __conn: ConnectionStep<any> }>,
              ) {
                const $connection = get($parent, "__conn");
                return $connection.pageInfo();
              },
            [get],
          ),
        },
      },
    },
  };
});

function uniq<T>(list: T[]): T[] {
  return [...new Set(list)];
}

export const preset = { plugins: [extensionsPlugin] };
