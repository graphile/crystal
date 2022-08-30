const core = require("./core");

test(
  "view with fake unique constraints and primary key",
  core.test(
    __filename,
    ["smart_comment_relations"],
    {},
    pgClient =>
      pgClient.query(
        `
comment on view smart_comment_relations.houses is E'@name houses
@primaryKey street_id,property_id
@unique street_name,property_id
@unique street_id,property_name_or_number
@unique street_name,building_name';`
      ),
    schema => {
      const Query = schema.getType("Query");
      const queryFields = Query.getFields();
      expect(queryFields.houseByStreetIdAndPropertyId).toBeTruthy();
      expect(queryFields.houseByStreetNameAndPropertyId).toBeTruthy();
      expect(queryFields.houseByStreetIdAndPropertyNameOrNumber).toBeTruthy();
      expect(queryFields.houseByStreetNameAndBuildingName).toBeTruthy();
      expect(queryFields.nonsense).toBeFalsy();
    }
  )
);
