## Step 1: Planning phase

Before we can execute our plans we must first establish a context in which to create the plans. We call this context the
"Aether." Aethers may be shared between multiple GraphQL requests so long as they meet the relevant requirements (based
on matching {schema}, {document} and {operationName}, and passing relevant tests on the values that they have referenced
within {variables} / {context} / {rootValue}).

Sharing Aethers across GraphQL requests also allows us to batch execution of certain plans across requests, leading to
massively improved performance - especially for subscription operations which may result in thousands of concurrent
GraphQL selection set executions all triggered at the same moment from the same pub/sub event.

Note that the plans in the Aether may differ from other Aethers in subtle ways, for example due to directives such as
`@skip`, `@include`, `@defer` and `@stream`. Use of these directives may cause plans to branch in different ways, and
thus separate Aethers are required to represent them. Variables that control these directives would be evaluated at
"planning time" (during aether construction), so different values will result in different aethers; however despite this
you may use the same aether for different variables assuming those different variables are **only** used during the
"plan execution phase" and not during the "planning phase".

Note: where `graphql.Something` is referenced below it means use a very similar algorithm as in the GraphQL spec,
however you will be given a {TrackingProxy()} rather than the direct {variable}, {context} and {rootValue} values; so
you need to access the properties using `.get` or `.is`. To reduce noise, we've not yet included these updated
algorithms in this spec.

EstablishAether(cache, schema, document, operationName, variables, context, rootValue):

- Let {matchingAethers} be all the Aethers in {cache}.
- For each {possibleAether} in {matchingAethers}:
  - If {IsEatherCompatible(possibleAether, schema, document, operationName, variables, context, rootValue)}:
    - Return {possibleAether}.
- Let {aether} be the result of calling {NewAether(schema, document, operationName, variables, context, rootValue)}.
- Store {aether} into {cache} (temporarily).
- Return {aether}.

IsEatherCompatible(aether, schema, document, operationName, variables, context, rootValue):

- If {aether.schema} is not equal to {schema}:
  - Return {false}.
- If {aether.document} is not equal to {document}:
  - Return {false}.
- If {aether.operationName} is not equal to {operationName}:
  - Return {false}.
- If not {MatchesConstraints(aether.variableConstraints, variables)}:
  - Return {false}.
- If not {MatchesConstraints(aether.contextConstraints, context)}:
  - Return {false}.
- If not {MatchesConstraints(aether.rootValueConstraints, rootValue)}:
  - Return {false}.
- Return {true}.

MatchesConstraints(constraints, object):

- For each key {key} in object {constraints}:
  - Let {keyConstraints} be the value of {constraints} stored under key {key}.
  - Let {keyValue} be the value of {object} stored under key {key}.
  - For each entry {constraint} in {keyConstraints}:
    - If not {MatchesConstraint(constraint, keyValue)}:
      - Return {false}.
- Return {true}.

MatchesConstraint(constraint, value):

- If {constraint.type} is {'value'}:
  - Return {true} if {value} is equal to {constraint.value}, otherwise {false}.
- If {constraint.type} is {'equal'}:
  - Return {constraint.pass} if {value} is {constraint.value}, otherwise not {constraint.pass}.
- Raise unknown constraint error.

Note: we don't just use 'value' for {true}/{false} because booleans are trinary ({true}, {false}, {null}, or even not
specified), and when we evaluate `@skip(if: $var)` or `@include(if: $var)` we only care if `$var` is {true} or not
{true} respectively, all other values are "bundled together" into a separate branch. This means that for queries
involving one instance of a nullable `@skip(if: $var)` only two Aether's would be required to represent all states of
`$var` (one for {true}; and one for {false}, {null} and undefined) rather than 4.

NewAether(schema, document, operationName, variables, context, rootValue):

- Let {aether} be an empty object.
- Let {aether.schema} be {schema}.
- Let {aether.document} be {document}.
- Let {aether.operationName} be {operationName}.
- Let {aether.operation} be the result of {graphql.GetOperation(document, operationName)}.
- Let {aether.variableConstraints} be an empty object.
- Let {aether.trackedVariables} be {TrackingProxy(variables, aether.variableConstraints)}.
- Let {aether.contextConstraints} be an empty object.
- Let {aether.trackedContext} be {TrackingProxy(context, aether.contextConstraints)}.
- Let {aether.rootValueConstraints} be an empty object.
- Let {aether.trackedRootValue} be {TrackingProxy(rootValue, aether.rootValueConstraints)}.
- Let {aether.subscribePlan} be {null}.
- Let {aether.planByPathIdentity} be an empty object.
- Let {aether.rootPlan} be {TrackedValuePlan(trackedRootValue)}.
- If {aether.operation} is a query operation:
  - Let {aether.operationType} be {"query"}.
  - Call {PlanAetherQuery(aether)}.
- Otherwise, if {aether.operation} is a mutation operation:
  - Let {aether.operationType} be {"mutation"}.
  - Call {PlanAetherMutation(aether)}.
- Otherwise, if {aether.operation} is a subscription operation:
  - Let {aether.operationType} be {"subscription"}.
  - Call {PlanAetherSubscription(aether)}.
- Otherwise:
  - Raise unknown operation type error.
- Return {aether}.

TrackingProxy(object, constraints):

- Return a proxy {p} over {object}, such that:
  - {p.get(attr)} adds `{type:'value',value:object[attr]}` to {constraints} and returns the property {object[attr]}.
  - {p.is(attr, value)} adds `{type:'equal',value:value,pass:value===object[attr]}` to {constraints} and returns
    {value===object[attr]}.

ValuePlan():

- TODO: this represents a concrete object value that'll be passed later; e.g. the result of the parent resolver when the
  parent resolver does not return a plan. Like all plans it actually represents a batch of values; you can
  `.get(attrName)` to get a plan that resolves to the relevant attribute value from the value plan.

PlanAetherQuery(aether):

- Let {rootType} be the root Query type in {aether.schema}.
- Let {selectionSet} be the top level Selection Set in {aether.operation}.
- Call {PlanAetherSelectionSet(aether, "", aether.rootPlan, rootType, selectionSet)}.

PlanAetherMutation(aether):

- Let {rootType} be the root Mutation type in {aether.schema}.
- Let {selectionSet} be the top level Selection Set in {aether.operation}.
- Call {PlanAetherSelectionSet(aether, "", aether.rootPlan, rootType, selectionSet, true)}.

PlanAetherSubscription(aether):

- Let {rootType} be the root Subscription type in {aether.schema}.
- Let {selectionSet} be the top level Selection Set in {aether.operation}.
- Let {groupedFieldSet} be the result of {graphql.CollectFields(rootType, selectionSet, aether.trackedVariables)}.
- If {groupedFieldSet} does not have exactly one entry, throw a query error.
- Let {fields} be the value of the first entry in {groupedFieldSet}.
- Let {fieldName} be the name of the first entry in {fields}. Note: This value is unaffected if an alias is used.
- Let {field} be the field named {fieldName} on {rootType}.
- Let {subscriptionPlanResolver} be {field.extensions.graphile.subscribePlan}.
- If {subscriptionPlanResolver} exists:
  - Let {aether.subscribePlan} be {Plan(aether, aether.rootPlan, subscriptionPlanResolver)}.
- Call {PlanAetherSelectionSet(aether, "", aether.subscribePlan, rootType, selectionSet)}.

TODO: should we be passing aether.subscribePlan here? Something else?

PlanAetherSelectionSet(aether, path, parentPlan, objectType, selectionSet, isSequential):

- If {isSequential} is not provided, initialize it to {false}.
- Assert: {objectType} is an object type.
- Let {groupedFieldSet} be the result of {graphql.CollectFields(objectType, selectionSet, aether.trackedVariables)}.
- For each {groupedFieldSet} as {responseKey} and {fields}:
  - Let {pathIdentity} be {path + ">" + objectType.name + "." + responseKey}.
  - Let {field} be the first entry in {fields}.
  - Let {fieldName} be the name of {field}. Note: This value is unaffected if an alias is used.
  - Let {fieldType} be the return type defined for the field {fieldName} of {objectType}.
  - Let {planResolver} be {field.extensions.graphile.subscribePlan}.
  - If {planResolver} is not {null}:
    - Let {plan} be {Plan(aether, parentPlan, planResolver)}.
    - Set {plan} as the value for {pathIdentity} in {aether.planByPathIdentity}.
  - Otherwise:
    - Let {plan} be {ValuePlan()}.
  - Let {unwrappedFieldType} be the named type of {fieldType}.
  - TODO: what do list types mean for plans?
  - If {unwrappedFieldType} is an Object, Interface or Union type:
    - Let {subSelectionSet} be the result of calling {graphql.MergeSelectionSets(fields)}.
    - If {unwrappedFieldType} is an object type:
      - Call {PlanAetherSelectionSet(aether, pathIdentity, plan, unwrappedFieldType, subSelectionSet, false).
    - Otherwise, if {unwrappedFieldType} is a union type:
      - Let {possibleObjectTypes} be all the object types that can be accessed in {subSelectionSet} that are compatible
        with {unwrappedFieldType}.
      - For each {objectType} in {possibleObjectTypes}:
        - Call {PlanAetherSelectionSet(aether, pathIdentity, plan, objectType, subSelectionSet, false).
    - Otherwise:
      - Assert: {unwrappedFieldType} is an interface type.
      - If any non-introspection field in {subSelectionSet} is selected on the interface type itself:
        - Let {possibleObjectTypes} be all the object types that implement the {unwrappedFieldType} interface.
        - For each {objectType} in {possibleObjectTypes}:
          - Call {PlanAetherSelectionSet(aether, pathIdentity, plan, objectType, subSelectionSet, false).
      - Otherwise:
        - Note: this is the same approach as for union types.
        - Let {possibleObjectTypes} be all the object types that can be accessed in {subSelectionSet} that are
          compatible with {unwrappedFieldType}.
        - For each {objectType} in {possibleObjectTypes}:
          - Call {PlanAetherSelectionSet(aether, pathIdentity, plan, objectType, subSelectionSet, false).

Plan(aether, parentPlan, planResolver):
