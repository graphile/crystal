# Graphile Crystal

# Step 1. Planning phase

:: Before we can execute our plans we must first establish a context in which to create the plans. We call this context
the _Aether_.

*Aether*s may be shared between multiple GraphQL requests so long as they meet the relevant requirements (based on
matching {schema}, {document} and {operationName}, and passing relevant tests on the values that they have referenced
within {variableValues} / {context} / {rootValue}).

Sharing Aethers across GraphQL requests also allows us to batch execution of certain plans across requests, leading to
massively improved performance - especially for subscription operations which may result in thousands of concurrent
GraphQL selection set executions all triggered at the same moment from the same pub/sub event.

It's important to note that the plans in the Aether may differ from other Aethers in subtle ways, for example due to
directives such as `@skip`, `@include`, `@defer` and `@stream`. Use of these directives may cause plans to branch in
different ways, and thus separate Aethers are required to represent them. Variables that control these directives would
be evaluated at "planning time" (during aether construction), so different values will result in different aethers;
however despite this you may use the same aether for different variables assuming those different variables are **only**
used during the "plan execution phase" and not during the "planning phase".

Note: Where `graphqlSomething` is referenced below it means use a very similar algorithm as in the GraphQL spec, however
you will be given a {\_\_TrackedObjectPlan()} rather than the direct {variable}, {context} and {rootValue} values; so
you need to access the properties using `.get` or `.is`. To reduce noise, we've not yet included these updated
algorithms in this spec.

The first thing we need to do is call {EstablishAether()} to get the aether within which the operation will execute;
this will also involve performing the planning if it hasn't already been done. Once we have the aether we can move on to
the execution phase.

### Global cache

:: _globalCache_ is a global cache for performance.

### Establish Aether

Status: complete.

EstablishAether(schema, document, operationName, variableValues, context, rootValue):

- Let {possibleAethers} be all the Aethers in _globalCache_.
- For each {possibleAether} in {possibleAethers}:
  - If {IsAetherCompatible(possibleAether, schema, document, operationName, variableValues, context, rootValue)}:
    - Return {possibleAether}.
- Let {aether} be the result of calling {NewAether(schema, document, operationName, variableValues, context,
  rootValue)}.
- Store {aether} into _globalCache_ (temporarily).
- Return {aether}.

### Is Aether compatible?

Status: complete.

IsAetherCompatible(aether, schema, document, operationName, variableValues, context, rootValue):

- If {aether}.{schema} is not equal to {schema}:
  - Return {false}.
- If {aether}.{document} is not equal to {document}:
  - Return {false}.
- If {aether}.{operationName} is not equal to {operationName}:
  - Return {false}.
- Let {variableValuesConstraints} be {aether}.{variableValuesConstraints}.
- Let {contextConstraints} be {aether}.{contextConstraints}.
- Let {rootValueConstraints} be {aether}.{rootValueConstraints}.
- If not {MatchesConstraints(variableValuesConstraints, variableValues)}:
  - Return {false}.
- If not {MatchesConstraints(contextConstraints, context)}:
  - Return {false}.
- If not {MatchesConstraints(rootValueConstraints, rootValue)}:
  - Return {false}.
- Return {true}.

### Matches constraints

Status: complete.

MatchesConstraints(constraints, object):

- For each {constraint} in {constraints}:
  - If not {MatchesConstraint(constraint, object)}:
    - Return {false}.
- Return {true}.

### Matches constraint

Status: complete.

MatchesConstraint(constraint, value):

- TODO: update this to match new constraints logic (constraint contains a path to navigate through the value).

- If {constraint}.{type} is {'value'}:
  - Return {true} if {value} is equal to {constraint}.{value}, otherwise {false}.
- If {constraint}.{type} is {'equal'}:
  - Return {constraint}.{pass} if {value} is {constraint}.{value}, otherwise not {constraint}.{pass}.
- Raise unknown constraint error.

Note: We don't just use 'value' for {true}/{false} because booleans are trinary ({true}, {false}, {null}, or even not
specified), and when we evaluate `@skip(if: $var)` or `@include(if: $var)` we only care if `$var` is {true} or not
{true} respectively, all other values are "bundled together" into a separate branch. This means that for queries
involving one instance of a nullable `@skip(if: $var)` only two Aether's would be required to represent all states of
`$var` (one for {true}; and one for {false}, {null} and undefined) rather than 4.

### New Aether

Status: complete.

NewAether(schema, document, operationName, variableValues, context, rootValue):

- Let {aether} be an empty object.
- Let {aether}.{schema} be {schema}.
- Let {aether}.{document} be {document}.
- Let {aether}.{operationName} be {operationName}.
- Let {aether}.{operation} be the result of {graphqlGetOperation(document, operationName)}.

- Let {aether}.{maxGroupId} be {0}.
- Let {aether}.{groupId} be {aether}.{maxGroupId}.
- Let {aether}.{plans} be an empty list.
- Let {aether}.{batchByPathIdentity} be an empty map.
- Let {aether}.{planIdByPathIdentity} be an empty map.
- Let {aether}.{valueIdByObjectByPlanId} be an empty map.

- Let {variableValuesConstraints} be an empty list.
- Let {variableValuesPlan} be {\_\_ValuePlan(aether)}.
- Let {aether}.{variableValuesConstraints} be {variableValuesConstraints}.
- Let {aether}.{variableValuesPlan} be {variableValuesPlan}.
- (TODO: this should use a more intelligent tracked object plan since the variables are strongly typed (unlike
  context/rootValue).)
- Let {aether}.{trackedVariableValuesPlan} be {\_\_TrackedObjectPlan(aether, variableValuesPlan, variableValues,
  variableValuesConstraints)}.

- Let {contextConstraints} be an empty list.
- Let {contextPlan} be {\_\_ValuePlan(aether)}.
- Let {aether}.{contextConstraints} be {contextConstraints}.
- Let {aether}.{contextPlan} be {contextPlan}.
- Let {aether}.{trackedContextPlan} be {\_\_TrackedObjectPlan(aether, contextPlan, context, contextConstraints)}.

- Let {rootValueConstraints} be an empty list.
- Let {rootValuePlan} be {\_\_ValuePlan(aether)}.
- Let {aether}.{rootValueConstraints} be {rootValueConstraints}.
- Let {aether}.{rootValuePlan} be {rootValuePlan}.
- Let {aether}.{trackedRootValuePlan} be {\_\_TrackedObjectPlan(aether, rootValuePlan, rootValue,
  rootValueConstraints)}.

* If {aether}.{operation} is a query operation:
  - Let {aether}.{operationType} be {"query"}.
  - Call {PlanAetherQuery(aether)}.
* Otherwise, if {aether}.{operation} is a mutation operation:
  - Let {aether}.{operationType} be {"mutation"}.
  - Call {PlanAetherMutation(aether)}.
* Otherwise, if {aether}.{operation} is a subscription operation:
  - Let {aether}.{operationType} be {"subscription"}.
  - Call {PlanAetherSubscription(aether)}.
* Otherwise:
  - Raise unknown operation type error.
* Call {OptimizePlans(aether)}.
* Call {TreeShakePlans(aether)}.
* Call {FinalizePlans(aether)}.
* Return {aether}.

### Optimize plans

Status: complete.

OptimizePlans(aether):

- For each {plan} with index {i} in {aether}.{plans} in reverse order:
  - Let {optimizedPlan} be {OptimizePlan(aether, plan)}.
  - Let the {i}th entry in {aether}.{plans} be {optimizedPlan}.
- Return.

### Optimize plan

Status: stubbed.

OptimizePlan(aether, plan):

- Return plan.

TODO: merge similar plans, etc.

Note: we must never optimise {\_\_ValuePlan()} plans.

### Tree shake plans

Status: complete.

TreeShakePlans(aether):

- Let {activePlans} be an empty list.
- For each key {pathIdentity} and value {planId} in {aether}.{planIdByPathIdentity}:
  - Let {plan} be the plan at index {planId} within {aether}.{plans}.
  - Call {MarkPlanActive(plan, activePlans)}.
- For each {inactivePlan} with index {i} in {aether}.{plans} where {inactivePlan} isn't in {activePlans}:
  - Replace the {i}th entry in {aether}.{plans} with {null}.

Note: Replacing inactive plans with null is not strictly necessary, but it may help catch bugs earlier. Maybe only do
this in development. Maybe don't do it if it makes the TypeScript too annoying.

### Mark plan active

Status: complete.

MarkPlanActive(plan, activePlans):

- If {plan} is within {activePlans}:
  - Return.
- Add {plan} to {activePlans}.
- For each {dependencyPlan} in {plan}.{dependencies}:
  - Call {MarkPlanActive(dependencyPlan, activePlans)}.
- For each {childPlan} in {plan}.{children}:
  - Call {MarkPlanActive(dependencyPlan, activePlans)}.

### Finalize plans

Status: complete.

FinalizePlans(aether):

- Let {activePlans} be the _distinct_ active plans within {aether}.{plans}.
- For each {activePlan} in {activePlans} in reverse order:
  - Call {FinalizePlan(aether, activePlan)}.

Note: FinalizePlans is the stage at which the SQL, GraphQL, etc query may be built; before this time it's not clear what
the selection will be as intermediate plans may have been discarded.

This is where the SQL generation would occur.

### Finalize plan

Status: complete.

FinalizePlan(aether, plan):

- Let {finalize} be the internal function provided by {plan} for finalizing the plan.
- Calling {finalize}.
- Let {plan}.{finalized} be {true}.

### Tracked object plan

Status: complete.

{\_\_TrackedObjectPlan} will have its values provided at runtime via the supplied {\_\_ValuePlan}. It is also supplied
with the original values (the ones the Aether was created with) which will be used via the `eval*` methods to narrow the
scope of the Aether.

\_\_TrackedObjectPlan(aether, valuePlan, value, constraints, path):

- If {path} is not provided, initialize it to an empty list.
- Let {plan} be {NewPlan(aether)}.
- Add {valuePlan} to {plan}'s {dependencies}.
- Let the internal function provided by {plan} for executing the plan, {execute}, be a function that returns the value
  from {valuePlan}.
- Augment {plan} such that:
  - Calls to `plan.get(attr)`:
    - Let {newPath} be a copy of {path} with {attr} appended.
    - Let {subValue} be `value[attr]`.
    - Let {subValuePlan} be {valuePlan}.{get(attr)}.
    - Return {\_\_TrackedObjectPlan(aether, subValuePlan, subValue, constraints, newPath)}.
  - Calls to `plan.eval()`:
    - Add `{type: 'value', path: path, value: value}` to {constraints}.
    - Return {value}.
  - Calls to `plan.evalIs(expectedValue)`:
    - Let {pass} be `value === expectedValue`.
    - Add `{type: 'equal', path: path, expectedValue: expectedValue, pass: pass}` to {constraints}.
    - Return {pass}.
  - Calls to `plan.evalHas(attr)`:
    - Let {newPath} be a copy of {path} with {attr} appended.
    - Let {exists} be whether the property `value[attr]` exists ({null} exists, {undefined} does not).
    - Add `{type: 'exists', path: newPath, exists: exists}` to {constraints}.
    - Return {exists}.
  - TODO: split array stuff into separate thing?
  - Calls to `plan.at(idx)`:
    - Let {newPath} be a copy of {path} with {idx} appended.
    - Let {subValue} be `value[idx]`.
    - Let {subValuePlan} be {valuePlan}.{at(idx)}.
    - Return {\_\_TrackedObjectPlan(aether, subValuePlan, subValue, constraints, newPath)}.
  - Calls to `plan.evalLength()`:
    - Assert: {value} is an array.
    - Let {length} be the length of the array {value}.
    - Add `{type: 'length', path: path, expectedLength: length}` to {constraints}.
    - Return {length}.
  - (In future, maybe `plan.evalContains(childValue)` e.g. for JWT scopes?)
- Return {plan}.

Note: A {\_\_TrackedObjectPlan()} is like {ValuePlan()} but with extra `eval` methods that allow branching the plan
formation during planning. No other plans allow this kind of plan-time branching because planning is synchronous, and
{\_\_TrackedObjectPlan()} is the only type that represents these synchronous pieces of data.

### Input plan

Status: complete.

InputPlan(aether, inputType, inputValue, defaultValue):

- If {inputValue} is a {Variable}:
  - Let {variableName} be the name of {inputValue}.
  - Let {variableType} be the expected input type for variable {variableName} in {aether}.{operation}.
  - Return {InputVariablePlan(aether, variableName, variableType, inputType, defaultValue)}.
- (Note: past here, we know whether {defaultValue} will be used or not because we know {inputValue} is not a variable.)
- If {inputValue} does not exist:
  - Let {inputValue} be an AST representation of {defaultValue}.
- If {inputType} is a non-null type:
  - Let {innerType} be the inner type of {inputType}.
  - Let {valuePlan} be {InputPlan(aether, innerType, inputValue)}.
  - Return {InputNonNullPlan(aether, valuePlan)}.
- Otherwise, if {inputType} is a List type:
  - Let {innerType} be the inner type of {inputType}.
  - Return {InputListPlan(aether, innerType, inputValue)}.
- Otherwise, if {inputType} is a leaf type:
  - Return {InputStaticLeafPlan(aether, inputType, inputValue)}
- Otherwise, if {inputType} is an input object type:
  - Return {InputObjectPlan(aether, inputType, inputValue)}.
- Otherwise:
  - Raise an unsupported input type error.

### Input variable plan

Status: complete.

InputVariablePlan(aether, variableName, variableType, inputType, defaultValue):

- If {variableType} is a non-null type and {inputType} is not a non-null type:
  - Let {unwrappedVariableType} be the inner type of {variableType}.
  - Return {InputVariablePlan(aether, variableName, unwrappedVariableType, inputType, defaultValue)}.
- Assert: {variableType} is equal to {inputType}.
- Let {variableValuePlan} be {aether}.{trackedVariableValuesPlan}.{get(variableName)}.
- If {defaultValue} does not exist:
  - Return {variableValuePlan}.
- Otherwise, if {variableValuePlan}.{evalIs(undefined)}:
  - (Note: we're going to pretend no value was passed instead of the variable, so defaultValue should be used.)
  - Return {InputPlan(aether, inputType, undefined, defaultValue)}.
- Otherwise:
  - (Note: {variableValuePlan} would eval to something other than {undefined}, so {defaultValue} will not be used.)
  - Return {variableValuePlan}.

Note: GraphQL validation will ensure that the type of the variable and input type are "compatible"; so the only
difference allowed is that the variable might be non-null when the input type is not.

Note: The GraphQL algorithm {CoerceVariableValues} will ensure that the contents of the variables adhere to the expected
types, so we do not need to perform coercion ourselves.

### Input coercion plan

Status: probably not needed; evaluate later.

InputCoercionPlan(aether, inputType, innerPlan):

- Let {plan} be {NewPlan(aether)}.
- Add {innerPlan} to {plan}.{dependencies}.
- Let the internal function provided by {plan} for executing the plan, {execute}, be a function that:
  - Let {results} be an empty list.
  - For each input crystal object {crystalObject}:
    - Let {innerValue} be the value associated with {innerPlan} within {crystalObject}.
    - Let {coercedValue} be the result of coercing {innerValue} according to the input coercion rules of {inputType}.
    - Add {coercedValue} to {results}.
  - Return {results}.
- Augment {plan} such that:
  - Calls to `plan.eval()`:
    - Let {innerValue} be the result of calling `innerPlan.eval()`.
    - Let {coercedValue} be the result of coercing {innerValue} according to the input coercion rules of {inputType}.
    - Return {coercedValue}.
- Return {plan}.

TODO: delete this plan? Leaves are already coerced; we coerce lists implicitly, maybe we don't need it? Really comes
down to variables, methinks.

### Input non-null plan

Status: complete.

InputNonNullPlan(aether, innerPlan):

- Return {innerPlan}.

Note: We rely on GraphQL to validate the inputs fully; this does mean that we rely on the
[default values fix](https://github.com/graphql/graphql-spec/pull/793), but this is a concern of the schema designer -
so long as the defaults are fully specified the client cannot cause issues here.

The following old implementation is not to be used:

OldInputNonNullPlan(aether, innerPlan):

- Let {plan} be {NewPlan(aether)}.
- Add {innerPlan} to {plan}.{dependencies}.
- Let the internal function provided by {plan} for executing the plan, {execute}, be a function that:
  - Let {results} be an empty list.
  - For each input crystal object {crystalObject}:
    - Let {innerValue} be the value associated with {innerPlan} within {crystalObject}.
    - If {innerValue} is {null} or does not exist:
      - Add a non-null error to {results}.
    - Otherwise:
      - Add {innerValue} to {results}.
  - Return {results}.
- Augment {plan} such that:
  - Calls to `plan.eval()`:
    - Let {innerValue} be the result of calling `innerPlan.eval()`.
    - If {innerValue} is {null} or does not exist:
      - Throw a non-null error.
    - Otherwise:
      - Return {innerValue}.
- Return {plan}.

### Input list plan

Status: complete.

InputListPlan(aether, inputType, inputValues):

- Assert {inputType} is a list type.
- Let {innerType} be the inner type of {inputType}.
- Let {plan} be {NewPlan(aether)}.
- Let {itemPlans} be an empty list.
- If {inputValues} is a list, for each {inputValue} in {inputValues}:
  - Let {innerPlan} be {InputPlan(aether, innerType, inputValue)}.
  - Add {innerPlan} to {itemPlans}.
- Let {outOfBoundsPlan} be {InputPlan(aether, innerType, undefined)}.
- Let the internal function provided by {plan} for executing the plan, {execute}, be a function that:
  - Let {results} be an empty list.
  - For each input crystal object {crystalObject}:
    - If {inputValues} is the {null} literal:
      - Add {null} to {results}.
    - Otherwise:
      - Let {list} be an empty list.
      - For {itemPlan} in {itemPlans}:
        - Let {value} be `itemPlan.eval()`.
        - Add {value} to {list}.
      - Add {list} to {results}.
  - Return {results}.
- Augment {plan} such that:
  - Calls to `plan.at(index)`:
    - Let {itemPlan} be the {index}th plan in {itemPlans}, or {outOfBoundsPlan} if {index} is out of bounds.
    - Return {itemPlan}.
  - Calls to `plan.eval()`:
    - If {inputValues} is the {null} literal:
      - Return {null}.
    - Otherwise:
      - Let {list} be an empty list.
      - For {itemPlan} in {itemPlans}:
        - Let {value} be `itemPlan.eval()`.
        - Add {value} to {list}.
      - Return {list}.
- Return {plan}.

Note: Though this may have variables for values within the list, it is not a variable itself (it has a known length in
the AST) thus we can return different plans for different elements in the list.

### Input static leaf plan

Status: complete.

InputStaticLeafPlan(aether, inputType, value):

- Let {plan} be {NewPlan(aether)}.
- Let {coercedValue} be the result of coercing {value} according to the input coercion rules of {inputType}.
- Let the internal function provided by {plan} for executing the plan, {execute}, be a function that returns
  {coercedValue} for each input crystal object.
- Augment {plan} such that:
  - Calls to `plan.eval()`:
    - Return {coercedValue}.
- Return {plan}.

This represents a static "leaf" value, but will return it via a plan. The plan will always evaluate to the same value.

### Input object plan

Status: complete.

InputObjectPlan(aether, inputObjectType, inputValues):

- Let {plan} be {NewPlan(aether)}.
- Let {inputFieldDefinitions} be the input fields defined by {inputObjectType}.
- Let {inputFieldPlans} be an empty map.
- For each {inputFieldDefinition} in {inputFieldDefinitions}:
  - Let {inputFieldName} be the name of {inputFieldDefinition}.
  - Let {inputFieldType} be the expected type of {inputFieldDefinition}.
  - Let {defaultValue} be an AST representation of the default value for {inputFieldDefinition}.
  - Let {inputFieldValue} be the value in {inputValues} for key {inputFieldName}.
  - Let {inputFieldPlan} be {InputPlan(aether, inputFieldType, inputFieldValue, defaultValue)}.
  - Set {inputFieldPlan} as the value for key {inputFieldName} in {inputFieldPlans}.
  - Add {inputFieldPlan} to {plan}.{dependencies}.
- Let the internal function provided by {plan} for executing the plan, {execute}, be a function that:
  - Let {results} be an empty list.
  - For each input crystal object {crystalObject}:
    - If {inputValues} is the {null} literal:
      - Add {null} to {results}.
    - Otherwise:
      - Let {values} be an empty map.
      - For each key {inputFieldName} and value {inputFieldPlan} in {inputFieldPlans}:
        - Let {value} be the value associated with {inputFieldPlan} within {crystalObject}.
        - Set {value} as the value for key {inputFieldName} in {values}.
      - Add {values} to {results}.
  - Return {results}.
- Augment {plan} such that:
  - Calls to `plan.get(inputFieldName)`:
    - Let {inputFieldPlan} be the value for key {inputFieldName} in {inputFieldPlans}.
    - Return {inputFieldPlan}.
  - Calls to `plan.eval()`:
    - If {inputValues} is the {null} literal:
      - Return {null}.
    - Let {values} be an empty map.
    - For each key {inputFieldName} and value {inputFieldPlan} in {inputFieldPlans}:
      - Let {value} be `inputFieldPlan.eval()`.
      - Set {value} as the value for key {inputFieldName} in {values}.
    - Return {values}.
- Return {plan}.

Note: This algorithm is very similar to {TrackedArguments()}.

### Tracked arguments

Status: complete

TrackedArguments(aether, objectType, field):

- Let {trackedArgumentValues} be an empty unordered map.
- Let {argumentValues} be the argument values provided in {field}.
- Let {fieldName} be the name of {field}.
- Let {argumentDefinitions} be the arguments defined by {objectType} for the field named {fieldName}.
- For each {argumentDefinition} in {argumentDefinitions}:
  - Let {argumentName} be the name of {argumentDefinition}.
  - Let {argumentType} be the expected type of {argumentDefinition}.
  - Let {defaultValue} be an AST representation of the default value for {argumentDefinition}.
  - Let {argumentValue} be the value in {argumentValues} for key {argumentName}.
  - Let {argumentPlan} be {InputPlan(aether, argumentType, argumentValue, defaultValue)}.
  - Set {argumentPlan} as the value for key {argumentName} in {trackedArgumentValues}.
- Return {trackedArgumentValues}.

Note: This algorithm is a replacement for
[CoerceArgumentValues](<https://spec.graphql.org/draft/#CoerceArgumentValues()>) in the GraphQL Spec.

Note: This algorithm is very similar to {InputObjectPlan()}.

Note: Arguments to a field are either static (in which case they're part of the document and will never change within
the same aether) or they are provided via variables. We want to track direct access to the variable type arguments via
{aether}.{trackedVariableValuesPlan}, but access to static arguments does not require any tracking at all.

Note: This recurses - values that are static input objects can contain variables within their descendent fields. This
recursion is handled via {InputPlan} which results in {InputStaticLeafPlan} for static values.

### New plan

Status: complete.

NewPlan(aether):

- Let {plan} be an empty object.
- Let {plan}.{dependencies} be an empty list. (Note: this is plans this plan will need the data from in order to
  execute.)
- Let {plan}.{children} be an empty list. (Note: this is plans that this plan might execute; currently it's the expected
  way that polymorphic plans (see {GetPolymorphicObjectPlanForType()}) might work.)
- Let {plan}.{finalized} be {false}.
- Let {plan}.{groupId} be {aether}.{groupId}.
- Let {plan}.{id} be the length of {aether}.{plans}.
- Push {plan} onto {aether}.{plans} (Note: it will have {plan}.{id} as its index within {aether}.{plans}).
- Return {plan}.

### Value plan

Status: complete.

This represents a concrete object value that'll be passed later; e.g. the result of the parent resolver when the parent
resolver does not return a plan. Like all plans it actually represents a batch of values; you can `.get(attrName)` to
get a plan that resolves to the relevant attribute value from the value plan.

\_\_ValuePlan(aether):

- Let {plan} be {NewPlan(aether)}.
- Let the internal function provided by {plan} for executing the plan, {execute}, be a function that throws an internal
  consistency error.
- Return {plan}.

Note: `__ValuePlan` has an underscore prefix since users should never use it; it's an internal plan.

Note: This plan is never executed; it's purely internal - we populate the value as part of the algorithm - see
{GetValuePlanId} and {PopulateValuePlan}.

### Get polymorphic object plan for type

Status: complete.

GetPolymorphicObjectPlanForType(aether, polymorphicPlan, objectType):

- Note: {polymorphicPlan} represents an interface or union.
- Let {planForType} be the internal function provided by {polymorphicPlan} to return a plan for a given object type.
- Assert {planForType} is not {null}.
- Let {objectPlan} be the result of calling {planForType}, passing {aether}, {polymorphicPlan} and {objectType}.
- Return {objectPlan}.

### Plan aether query

Status: complete.

PlanAetherQuery(aether):

- Let {rootType} be the root Query type in {aether}.{schema}.
- Assert {rootType} exists.
- Let {selectionSet} be the top level Selection Set in {aether}.{operation}.
- Let {trackedRootValuePlan} be {aether}.{trackedRootValuePlan}.
- Call {PlanSelectionSet(aether, "", trackedRootValuePlan, rootType, selectionSet)}.

### Plan aether mutation

Status: complete.

PlanAetherMutation(aether):

- Let {rootType} be the root Mutation type in {aether}.{schema}.
- Assert {rootType} exists.
- Let {selectionSet} be the top level Selection Set in {aether}.{operation}.
- Let {trackedRootValuePlan} be {aether}.{trackedRootValuePlan}.
- Call {PlanSelectionSet(aether, "", trackedRootValuePlan, rootType, selectionSet, true)}.

### Plan aether subscription

Status: complete.

PlanAetherSubscription(aether):

- Let {rootType} be the root Subscription type in {aether}.{schema}.
- Assert {rootType} exists.
- Let {selectionSet} be the top level Selection Set in {aether}.{operation}.
- Let {trackedVariableValuesPlan} be {aether}.{trackedVariableValuesPlan}.
- Let {groupedFieldSet} be the result of {GraphQLCollectFields(rootType, selectionSet, trackedVariableValuesPlan)}.
- If {groupedFieldSet} does not have exactly one entry, throw a query error.
- Let {fields} be the value of the first entry in {groupedFieldSet}.
- Let {fieldName} be the name of the first entry in {fields}. Note: This value is unaffected if an alias is used.
- Let {field} be the first entry in {fields}.
- Let {fieldSpec} be the field named {fieldName} on {rootType}.
- Let {subscriptionPlanResolver} be `fieldSpec.extensions.graphile.subscribePlan`.
- If {subscriptionPlanResolver} exists:
  - Let {trackedArguments} be {TrackedArguments(aether, rootType, field)}.
  - Let {trackedRootValuePlan} be {aether}.{trackedRootValuePlan}.
  - Let {subscribePlan} be the result of calling {subscriptionPlanResolver}, providing {trackedRootValuePlan},
    {trackedArguments}, {aether}.{trackedContextPlan}.
  - Call {PlanFieldArguments(aether, field, trackedArguments, subscribePlan)}.
- Otherwise:
  - Let {subscribePlan} be {aether}.{trackedRootValuePlan}.
- Call {PlanSelectionSet(aether, "", subscribePlan, rootType, selectionSet)}.

### Plan selection set

Status: complete (with caveats).

PlanSelectionSet(aether, path, parentPlan, objectType, selectionSet, isSequential):

- If {isSequential} is not provided, initialize it to {false}.
- Assert: {objectType} is an object type.
- Let {trackedVariableValuesPlan} be {aether}.{trackedVariableValuesPlan}.
- Let {groupedFieldSet} be the result of {GraphQLCollectFields(objectType, selectionSet, trackedVariableValuesPlan)}
  with modified algorithm to factor `groupId`/`maxGroupId` in (based on fragments with `@defer`, `@stream`, etc).
- For each {groupedFieldSet} as {responseKey} and {fields}:
  - Let {pathIdentity} be `path + ">" + objectType.name + "." + responseKey`.
  - Let {field} be the first entry in {fields}.
  - Let {fieldName} be the name of {field}. Note: This value is unaffected if an alias is used.
  - Let {fieldType} be the return type defined for the field {fieldName} of {objectType}.
  - If {field} provides the directive `@stream`:
    - Assert {fieldType} is a List type.
    - Let {oldGroupId} be {aether}.{groupId}.
    - Increment {aether}.{maxGroupId}.
    - Let {aether}.{groupId} be {aether}.{maxGroupId}.
  - Let {planResolver} be `field.extensions.graphile.plan`.
  - If {planResolver} is not {null}:
    - Let {trackedArguments} be {TrackedArguments(aether, objectType, field)}.
    - Let {plan} be the result of calling {planResolver}, providing {parentPlan}, {trackedArguments},
      {aether}.{trackedContextPlan}.
    - Call {PlanFieldArguments(aether, objectType, field, trackedArguments, plan)}.
  - Otherwise:
    - Let {plan} be {\_\_ValuePlan(aether)}. (Note: this is populated in {GetValuePlanId}.)
  - Set {plan}.{id} as the value for {pathIdentity} in {aether}.{planIdByPathIdentity}.
  - Let {unwrappedFieldType} be the named type of {fieldType}.
  - (Note: when implementing types, we should see the list depth of fieldType and assert that the data to be returned
    has the same depth if we can.)
  - If {unwrappedFieldType} is an Object, Interface or Union type:
    - Let {subSelectionSet} be the result of calling {graphqlMergeSelectionSets(fields)}.
    - If {unwrappedFieldType} is an object type:
      - Call {PlanSelectionSet(aether, pathIdentity, plan, unwrappedFieldType, subSelectionSet, false)}.
    - Otherwise, if {unwrappedFieldType} is a union type:
      - Assert {plan} is a polymorphic plan.
      - Let {possibleObjectTypes} be all the object types that can be accessed in {subSelectionSet} that are compatible
        with {unwrappedFieldType}.
      - For each {possibleObjectType} in {possibleObjectTypes}:
        - Let {subPlan} be {GetPolymorphicObjectPlanForType(aether, plan, possibleObjectType)}.
        - Call {PlanSelectionSet(aether, pathIdentity, subPlan, possibleObjectType, subSelectionSet, false)}.
    - Otherwise:
      - Assert {unwrappedFieldType} is an interface type.
      - Assert {plan} is a polymorphic plan.
      - If any non-introspection field in {subSelectionSet} is selected on the interface type itself, or any of the
        interfaces it implements:
        - Let {possibleObjectTypes} be all the object types that implement the {unwrappedFieldType} interface.
        - For each {possibleObjectType} in {possibleObjectTypes}:
          - Let {subPlan} be {GetPolymorphicObjectPlanForType(aether, plan, possibleObjectType)}.
          - Call {PlanSelectionSet(aether, pathIdentity, subPlan, possibleObjectType, subSelectionSet, false)}.
      - Otherwise:
        - Note: this is the same approach as for union types.
        - Let {possibleObjectTypes} be all the object types that can be accessed in {subSelectionSet} that are
          compatible with {unwrappedFieldType}.
        - For each {possibleObjectType} in {possibleObjectTypes}:
          - Let {subPlan} be {GetPolymorphicObjectPlanForType(aether, plan, possibleObjectType)}.
          - Call {PlanSelectionSet(aether, pathIdentity, subPlan, possibleObjectType, subSelectionSet, false)}.
  - Let {aether}.{groupId} be {oldGroupId}.
- Return.

**TODO**: what happens if a interface/union field does NOT have a plan? In this case the plan is a {\_\_ValuePlan} which
is not a polymorphic plan so the assertions will fail.

### GraphQL collect fields

Status: completed initial implementation (sans @stream/@defer); not specified.

As with the GraphQL {CollectFields()} algorithm, but with "tracked" access to variables via {\_\_TrackedObjectPlan()}
rather than direct access, and we must be careful to manipulate groupId/maxGroupId as appropriate when there are
`@stream` / `@defer` directives.

GraphQLCollectFields(objectType, selectionSet, trackedVariableValuesPlan):

- TODO.

### Plan field arguments

Status: complete.

PlanFieldArguments(aether, objectType, field, trackedArguments, fieldPlan):

- Let {fieldName} be the name of {field}.
- Let {fieldSpec} be the field named {fieldName} on {objectType}.
- For each argument {argumentSpec} in {fieldSpec}:
  - Let {argumentName} be the name of {argument}.
  - Let {trackedArgumentValuePlan} be the value for {argumentName} within {trackedArguments}.
  - If {trackedArgumentValuePlan} is defined (including {null}):
    - Call {PlanFieldArgument(aether, objectType, field, argument, trackedArgumentValuePlan, fieldPlan)}.
- Return.

### Plan field argument

Status: complete.

PlanFieldArgument(aether, objectType, field, argument, trackedArgumentValuePlan, fieldPlan):

- Let {fieldName} be the name of {field}.
- Let {argumentName} be the name of {argument}.
- Let {fieldSpec} be the field named {fieldName} on {objectType}.
- Let {argumentSpec} be the argument named {argumentName} on {fieldSpec}.
- Let {planResolver} be `argumentSpec.extensions.graphile.plan`.
- If {planResolver} exists:
  - Let {argumentPlan} be the result of calling {planResolver}, providing {fieldPlan}, {trackedArgumentValuePlan},
    {aether}.{trackedContextPlan}.
  - If {argumentPlan} is not {null}:
    - Assert {argumentPlan} is an argument plan.
    - Let {argumentType} be the expected type of {argument}.
    - Call {PlanInput(aether, argumentType, trackedArgumentValuePlan, argumentPlan)}.
- Return.

### Plan input

Status: complete, but badly typed.

PlanInput(aether, inputType, trackedValuePlan, parentPlan):

- If {inputType} is a non-null type:
  - Let {innerInputType} be the inner type of {inputType}.
  - Call {PlanInput(aether, innerInputType, trackedValuePlan, parentPlan)}.
  - Return.
- Otherwise, if {inputType} is a list type:
  - If {trackedValuePlan} {evalIs} {null}:
    - Call {parentPlan}.{null()}.
    - Return.
  - Let {innerInputType} be the inner type of {inputType}.
  - Let {length} be {trackedValuePlan}.{evalLength()}.
  - For {i} from {0...length-1}:
    - Let {listItemParentPlan} be the result of calling {parentPlan}.{itemPlan()}.
    - Let {trackedListValue} be {trackedValuePlan}.{at(i)}.
    - Call {PlanInput(aether, innerInputType, trackedListValue, listItemParentPlan)}.
  - Return.
- Otherwise, if {inputType} is an input object type:
  - If {trackedValuePlan} {evalIs} {null}:
    - TODO: should we indicate to the parent that this is null as opposed to an empty object?
    - Return.
  - Call {PlanInputFields(aether, inputType, trackedValuePlan, parentPlan)}.
- Otherwise, raise an invalid plan error.

Note: we are only expecting to {PlanInput()} for objects or lists thereof, not scalars.

### Plan input fields

Status: complete.

PlanInputFields(aether, inputObjectType, trackedValuePlan, parentPlan):

- For each input field {inputField} in {inputObjectType}:
  - Let {fieldName} be the name of {inputField}.
  - If {trackedValuePlan} {evalHas} {fieldName}:
    - Let {trackedFieldValue} be {trackedValuePlan}.{get(fieldName)}.
    - Call {PlanInputField(aether, inputField, trackedFieldValue, parentPlan)}.
- Return.

### Plan input field

Status: complete.

PlanInputField(aether, inputField, trackedValuePlan, parentPlan):

- Let {planResolver} be `inputField.extensions.graphile.plan`.
- Assert: {planResolver} exists.
- Let {inputFieldPlan} be the result of calling {planResolver}, providing {parentPlan}, {trackedValuePlan},
  {aether}.{trackedContextPlan}.
- If {inputFieldPlan} is not {null}:
  - Let {inputFieldType} be the expected type of {inputField}.
  - Note: the unwrapped type of {inputFieldType} must be an input object.
  - Call {PlanInput(aether, inputFieldType, trackedValuePlan, inputFieldPlan)}.
- Return.

# Step 2: execution phase

We're in a GraphQL resolver. We don't know what's going on, but we've been given a parent object (which may or may not
be crystal-related), arguments (which will be identical for all of our counterparts), context (which will be identical
for all of our counterparts) and details of the GraphQL schema, the document and operationName being executed, the
variables provided, the rootValue provided, and our position within the operation.

The first thing we need to do is figure out our aether, {aether}, via {EstablishAether()}.

Next we figure out our path identity, {pathIdentity}, within the operation.

Next we find the plan for ourself, {plan}, by looking for the {plan}.{id} stored in the {pathIdentity} entry in
{aether}.{planIdByPathIdentity}.

If there's no plan, we just call through to the underlying resolver and we're done. Otherwise...

If we're a "plan root" (that is to say, our parent field doesn't have a plan) then... Nothing special happens? Just
continue as normal.

We must execute the plan passing the relevant information. Note that, if we have any, our counterparts will be doing
this too, in parallel, and the plan should batch all these calls together into a `Batch` so that only one request needs
to be made to the underlying data store.

If executing the plan results in an error, throw the error. Otherwise we should wrap the result up into a object
(keeping track of all the previous values too (see the parent object), perhaps using their plan id?) which we then pass
through to the underlying resolver.

### Get value plan id

Status: pending.

GetValuePlanId(aether, valuePlan, object):

- Assert: {valuePlan} is a {\_\_ValuePlan}.
- Let {valueIdByObject} be the map for {valuePlan}.{id} within the map {aether}.{valueIdByObjectByPlanId} (creating the
  entry if necessary).
- Let {valueId} be the value for {object} within the map {valueIdByObject}.
- If {valueId} is set:
  - Return {valueId}.
- Otherwise:
  - Let {valueId} be a new unique id.
  - Call {PopulateValuePlan(crystalContext, valuePlan, valueId, object)}. (Note: this populates the {\_\_ValuePlan} for
    this specific parent.)
  - Set {valueId} as the value for {object} in {valueIdByObject}.
  - Return {valueId}.

### Resolve field value crystal

Status: complete.

ResolveFieldValueCrystal(schema, document, operationName, variableValues, context, rootValue, field, parentObject,
argumentValues, pathIdentity):

- Let {fieldName} be the name of {field}.
- Let {parentType} be the object type on which {field} is defined.
- Let {returnType} be the expected type of {field}.
- Let {aether} be {EstablishAether(schema, document, operationName, variableValues, context, rootValue)}.
- Let {planId} be the value for key {pathIdentity} within {aether}.{planIdByPathIdentity}.
- Let {plan} be the plan at index {planId} within {aether}.{plans}.
- If {plan} is null:
  - If {parentObject} is a crystal wrapped value:
    - Let {objectValue} be the data within {parentObject}.
  - Otherwise:
    - Let {objectValue} be {parentObject}.
  - Return {graphqlResolveFieldValue(parentType, objectValue, fieldName, argumentValues)}.
- Otherwise:
  - Let {id} be a new unique id.
  - Let {batch} be {GetBatch(aether, pathIdentity, parentObject, variableValues, context, rootValue)}.
  - Let {crystalContext} be {batch}.{crystalContext}.
  - Let {plan} be {batch}.{plan}.
  - If {parentObject} is a crystal object:
    - Let {parentCrystalObject} be {parentObject}. (Note: for the most optimal execution, `rootValue` passed to graphql
      should be a crystal object, this allows using {crystalContext} across the entire operation if plans are used
      everywhere. Even more optimised would be if we can share the same {crystalContext} across multiple `rootValue`s
      for multiple parallel executions (must be within the same aether) - e.g. as a result of multiple identical
      subscription operations.)
  - Otherwise:
    - (Note: we need to "fake" that the parent was a plan. Because we may have lots of resolvers all called for the same
      parent object, we use a map. This happens to mean that multiple values in the graph being the same object will be
      merged automatically.)
    - Let {parentPathIdentity} be the parent path for {pathIdentity}.
    - Let {parentPlanId} be the value for key {parentPathIdentity} within {aether}.{planIdByPathIdentity}.
    - Let {parentPlan} be the plan at index {parentPlanId} within {aether}.{plans}.
    - Let {parentId} be {GetValuePlanId(aether, parentPlan, parentObject)}.
    - Let {indexes} be an empty list.
    - Let {parentCrystalObject} be {NewCrystalObject(parentPlan, parentPathIdentity, parentId, indexes, parentObject,
      crystalContext)}.
  - Let {result} be {GetBatchResult(batch, parentCrystalObject)} (note: could be asynchronous).
  - ~~(Note: this field execution is identified as 'id', even if it's a nested list. Crystal abstracts away the list for
    you, so the crystal object received will always have a non-list value stored under 'id', but each entry in the
    returned results will have a different crystal object, all with the same 'id'. It's possible that 'id' is not the
    right name to give this property since there will be many with the same value.)~~
  - Return {CrystalWrap(crystalContext, plan, returnType, parentCrystalObject, pathIdentity, id, result)}.

### Crystal wrap

Status: complete.

CrystalWrap(crystalContext, plan, returnType, parentCrystalObject, pathIdentity, id, data, indexes):

- If {indexes} is not set, initialize it to an empty list.
- If {data} is {null}:
  - Return {null}.
- Otherwise, if {returnType} is a non-null type:
  - Let {innerType} be the inner type of {returnType}.
  - Return {CrystalWrap(crystalContext, plan, innerType, parentCrystalObject, pathIdentity, id, data)}.
- Otherwise, if {returnType} is a list type:
  - Let {innerType} be the inner type of {returnType}.
  - Let {result} be an empty list.
  - For each {entry} with index {index} in {data}:
    - Let {wrappedIndexes} be a list composed of everything in {indexes} followed by {index}.
    - Let {wrappedEntry} be {CrystalWrap(crystalContext, plan, innerType, parentCrystalObject, pathIdentity, id, entry,
      wrappedIndexes)}.
    - Push {wrappedEntry} onto {result}.
  - Return {result}.
- Otherwise:
  - If {parentCrystalObject} is provided:
    - Let {idByPathIdentity} be a reference to {parentCrystalObject}'s {idByPathIdentity}.
    - Let {indexesByPathIdentity} be a reference to {parentCrystalObject}'s {indexesByPathIdentity}.
  - Let {crystalObject} be {NewCrystalObject(plan, pathIdentity, id, indexes, data, crystalContext, idByPathIdentity,
    indexesByPathIdentity)}.
  - Return {crystalObject}.

### New crystal object

Status: complete.

NewCrystalObject(plan, pathIdentity, id, indexes, data, crystalContext, idByPathIdentity, indexesByPathIdentity):

- If {idByPathIdentity} is not set, initialize it to a map containing value {crystalContext}.{rootId} for key `""`.
- If {indexesByPathIdentity} is not set, initialize it to a map containing an empty list value for key `""`.
- Let {crystalObject} be an empty object.
- Let {crystalObject}.{crystalContext} be a reference to {crystalContext}.
- Let {crystalObject}.{idByPathIdentity} be an independent copy of {idByPathIdentity}.
- Let {crystalObject}.{indexesByPathIdentity} be an independent copy of {indexesByPathIdentity}.
- Let {crystalObject}.{data} be {data}.
- Set {id} as the value for key {pathIdentity} within {crystalObject}.{idByPathIdentity}.
- Set {indexes} as the value for key {pathIdentity} within {crystalObject}.{indexesByPathIdentity}.
- Return {crystalObject}.

### New crystal context

Status: complete.

NewCrystalContext(aether, variableValues, context, rootValue):

- Let {crystalContext} be an empty object.
- Let {crystalContext}.{resultByIdByPlan} be an empty map.
- Let {crystalContext}.{metaByPlan} be an empty map.
- Let {rootId} be a new unique id.
- Let {crystalContext}.{rootId} be {rootId}.
- Let {variableValuesPlan} be {aether}.{variableValuesPlan}.
- Call {PopulateValuePlan(crystalContext, variableValuesPlan, rootId, variableValues)}.
- Let {contextPlan} be {aether}.{contextPlan}.
- Call {PopulateValuePlan(crystalContext, contextPlan, rootId, context)}.
- Let {rootValuePlan} be {aether}.{rootValuePlan}.
- Call {PopulateValuePlan(crystalContext, rootValuePlan, rootId, rootValue)}.
- Return {crystalContext}.

### Populate value plan

Status: complete.

PopulateValuePlan(crystalContext, valuePlan, valueId, object):

- Set {object} as the value for entry {valueId} for entry {valuePlan} in {crystalContext}.{resultByIdByPlan}.

### Get batch

Status: complete.

GetBatch(aether, pathIdentity, parentObject, variableValues, context, rootValue):

- Let {batch} be the value for key {pathIdentity} within {aether}.{batchByPathIdentity}.
- If {batch} is null:
  - If {parentCrystalObject} is a crystal object:
    - Let {crystalContext} be {parentCrystalObject}.{crystalContext}.
  - Otherwise:
    - Let {crystalContext} be {NewCrystalContext(aether, variableValues, context, rootValue)}.
  - Let {batch} be {NewBatch(aether, pathIdentity, crystalContext)}.
  - Set {batch} as the value for key {pathIdentity} within {aether}.{batchByPathIdentity}.
  - Schedule {ExecuteBatch(aether, batch, crystalContext)} to occur soon (but asynchronously). (Note: when batch is
    executed it will delete itself from aether.batchByPathIdentity.)
- Return {batch}.

### New batch

Status: complete.

NewBatch(aether, pathIdentity, crystalContext):

- Let {batch} be an empty object.
- Let {batch}.{pathIdentity} be {pathIdentity}.
- Let {batch}.{crystalContext} be {crystalContext}.
- Let {planId} be the value for key {pathIdentity} within {aether}.{planIdByPathIdentity}.
- Let {plan} be the plan at index {planId} within {aether}.{plans}.
- Let {batch}.{plan} be {plan}.
- Let {batch}.{entries} be an empty list.
- Return {batch}.

### Execute batch

Status: pending.

ExecuteBatch(aether, batch, crystalContext):

- Delete the value for key {batch}.{pathIdentity} within {aether}.{batchByPathIdentity} (Note: this means a new batch
  will be used for later calls).
- Let {crystalObjects} be the first entry in each tuple within {batch}.{entries}.
- Let {deferredResults} be the second entry in each tuple within {batch}.{entries}.
- Let {plan} be {batch}.{plan}.
- Let {results} be the result of calling (asynchronously if necessary) {ExecutePlan(aether, plan, crystalContext,
  crystalObjects)}.
- Assert that the length of {results} matches the length of {deferredResults}.
- For each {deferredResult} with index {i} in {deferredResults}:
  - Let {result} be the {i}th entry in {results}.
  - Resolve {deferredResult} with {result}.
- Return.

### Get batch result

Status: pending.

GetBatchResult(batch, parentCrystalObject):

- Let {deferredResult} be a new {Defer}.
- Push the tuple `[parentCrystalObject, deferredResult]` onto {batch}.{entries}.
- Return {deferredResult}.

### Execute plan

Status: pending.

ExecutePlan(aether, plan, crystalContext, crystalObjects, visitedPlans):

- If {visitedPlans} is not provided, initialize it to an empty list.
- If {visitedPlans} contains {plan} throw new recursion error.
- Push {plan} into {visitedPlans}.
- Let {pendingCrystalObjects} be an empty list.
- Let {result} be a list with the same length as {crystalObjects}.
- For each {crystalObject} with index {i} in {crystalObjects}:
  - Let {previousResult} be the entry for key {crystalObject}.{id} for key {plan} in
    {crystalContext}.{resultByIdByPlan}.
  - If {previousResult} does exists:
    - Set {previousResult} as the {i}th indexed value of {result}.
  - Otherwise:
    - Push {crystalObject} onto {pendingCrystalObjects}.
- If {pendingCrystalObjects} is not empty:
  - Let {dependencyValuesList} be an empty list.
  - For each {dependencyPlan} in {plan}.{dependencies}:
    - Let {dependencyResult} be {ExecutePlan(aether, dependencyPlan, crystalContext, pendingCrystalObjects,
      visitedPlans)}.
    - Push {dependencyResult} onto {dependencyValuesList}.
  - Let {values} be an empty list.
  - For each index {i} in {pendingCrystalObjects}:
    - Let {entry} be an empty list.
    - For each {dependencyValues} in {dependencyValuesList}:
      - Let {dependencyValue} be the {i}th entry in {dependencyValues}.
      - Push {dependencyValue} onto {entry}.
    - Push {entry} onto {values}.
  - Let {execute} be the internal function provided by {plan} for executing the plan.
  - Let {meta} be the entry for {plan} within {crystalContext}.{metaByPlan}.
  - Let {pendingResult} be the result of calling {execute}, providing {values} and {meta}. (Note: the `execute` method
    on plans is responsible for memoizing results into {meta}.)
  - Assert the length of {pendingResult} should match the length of {pendingCrystalObjects}.
  - For each {pendingCrystalObject} with index {i} in {pendingCrystalObjects}:
    - Let {pendingResult} be the {i}th value in {pendingResult}.
    - Let {j} be the index of {pendingCrystalObject} within {crystalObjects}.
    - Set the value for key {pendingCrystalObject}.{id} for key {plan} in {crystalContext}.{resultByIdByPlan} to
      {pendingResult}.
    - Set {pendingResult} as the {j}th value of {result}.
- Return {result}.
