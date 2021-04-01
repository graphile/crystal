# Graphile Crystal

# Step 1. Planning phase

Before we can execute our plans we must first establish a context in which to create the plans. We call this context the
"Aether." Aethers may be shared between multiple GraphQL requests so long as they meet the relevant requirements (based
on matching {schema}, {document} and {operationName}, and passing relevant tests on the values that they have referenced
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
you will be given a {TrackedObjectPlan()} rather than the direct {variable}, {context} and {rootValue} values; so you
need to access the properties using `.get` or `.is`. To reduce noise, we've not yet included these updated algorithms in
this spec.

The first thing we need to do is call {EstablishAether()} to get the aether within which the operation will execute;
this will also involve performing the planning if it hasn't already been done. Once we have the aether we can move on to
the execution phase.

{globalCache} is a global cache for performance.

EstablishAether(schema, document, operationName, variableValues, context, rootValue):

- Let {matchingAethers} be all the Aethers in {globalCache}.
- For each {possibleAether} in {matchingAethers}:
  - If {IsAetherCompatible(possibleAether, schema, document, operationName, variableValues, context, rootValue)}:
    - Return {possibleAether}.
- Let {aether} be the result of calling {NewAether(schema, document, operationName, variableValues, context,
  rootValue)}.
- Store {aether} into {globalCache} (temporarily).
- Return {aether}.

IsAetherCompatible(aether, schema, document, operationName, variableValues, context, rootValue):

- If {aether}.{schema} is not equal to {schema}:
  - Return {false}.
- If {aether}.{document} is not equal to {document}:
  - Return {false}.
- If {aether}.{operationName} is not equal to {operationName}:
  - Return {false}.
- Let {variableConstraints} be {aether}.{variableConstraints}.
- Let {contextConstraints} be {aether}.{contextConstraints}.
- Let {rootValueConstraints} be {aether}.{rootValueConstraints}.
- If not {MatchesConstraints(variableConstraints, variableValues)}:
  - Return {false}.
- If not {MatchesConstraints(contextConstraints, context)}:
  - Return {false}.
- If not {MatchesConstraints(rootValueConstraints, rootValue)}:
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

NewAether(schema, document, operationName, variableValues, context, rootValue):

- Let {aether} be an empty object.
- Let {aether}.{schema} be {schema}.
- Let {aether}.{document} be {document}.
- Let {aether}.{operationName} be {operationName}.
- Let {aether}.{operation} be the result of {graphqlGetOperation(document, operationName)}.

- Let {aether}.{maxGroupId} be {0}.
- Let {aether}.{groupId} be {aether}.{maxGroupId}.
- Let {aether}.{plans} be an empty list.
- Let {aether}.{planIdByPathIdentity} be an empty map.
- Let {aether}.{valueIdByObjectByPlanId} be an empty map.

- Let {variablesConstraints} be an empty object.
- Let {aether}.{variablesConstraints} be {variablesConstraints}.
- Let {aether}.{variablesPlan} be {TrackedObjectPlan(aether, variableValues, variablesConstraints)}.

- Let {contextConstraints} be an empty object.
- Let {aether}.{contextConstraints} be {contextConstraints}.
- Let {aether}.{contextPlan} be {TrackedObjectPlan(aether, context, contextConstraints)}.

- Let {rootValueConstraints} be an empty object.
- Let {aether}.{rootValueConstraints} be {rootValueConstraints}.
- Let {aether}.{rootValuePlan} be {TrackedObjectPlan(aether, rootValue, rootValueConstraints)}.

- Let {aether}.{subscribePlan} be {null}.

- If {aether}.{operation} is a query operation:
  - Let {aether}.{operationType} be {"query"}.
  - Call {PlanAetherQuery(aether)}.
- Otherwise, if {aether}.{operation} is a mutation operation:
  - Let {aether}.{operationType} be {"mutation"}.
  - Call {PlanAetherMutation(aether)}.
- Otherwise, if {aether}.{operation} is a subscription operation:
  - Let {aether}.{operationType} be {"subscription"}.
  - Call {PlanAetherSubscription(aether)}.
- Otherwise:
  - Raise unknown operation type error.
- Call {OptimizePlans(aether)}.
- Call {TreeShakePlans(aether)}.
- Call {FinalizePlans(aether)}.
- Return {aether}.

OptimizePlans(aether):

- For each {plan} with index {i} in {aether}.{plans} in reverse order:
  - Let {optimizedPlan} be {OptimizePlan(aether, plan)}.
  - Let the {i}th entry in {aether}.{plans} be {optimizedPlan}.
- Return.

OptimizePlan(aether, plan):

- Return plan.

TODO: merge similar plans, etc.

Note: we must never optimise {\_\_ValuePlan()} plans.

TreeShakePlans(aether):

- For each key {pathIdentity} and value {planId} in {aether}.{planIdByPathIdentity}:
  - Let {plan} be the plan at index {planId} within {aether}.{plans}.
  - Call {MarkPlanActive(plan)}.
- For each {inactivePlan} with index {i} in {aether}.{plans} where {inactivePlan}.{active} is {false}:
  - Replace the {i}th entry in {aether}.{plans} with {null}.

Note: Replacing inactive plans with null is not strictly necessary, but it may help catch bugs earlier. Maybe only do
this in development. Maybe don't do it if it makes the TypeScript too annoying.

MarkPlanActive(plan, visitedPlans):

- If {visitedPlans} is not set, initialize it to an empty list.
- If {plan} is within {visitedPlans} throw an infinite recursion error.
- Add {plan} to {visitedPlans}.
- Let {plan}.{active} be {true}.
- For each {dependencyPlan} in {plan}.{dependencies}:
  - Call {MarkPlanActive(dependencyPlan)}.
- For each {childPlan} in {plan}.{children}:
  - Call {MarkPlanActive(dependencyPlan)}.

FinalizePlans(aether):

- Let {activePlans} be the _distinct_ active plans within {aether}.{plans}.
- For each {activePlan} in {activePlans} in reverse order:
  - Call {FinalizePlan(aether, activePlan)}.

Note: FinalizePlans is the stage at which the SQL, GraphQL, etc query may be built; before this time it's not clear what
the selection will be as intermediate plans may have been discarded.

FinalizePlan(aether, plan):

- Let {finalize} be the internal function provided by {plan} for finalizing the plan.
- Calling {finalize}.
- Let {plan}.{finalized} be {true}.

TrackedObjectPlan(aether, object, constraints, path):

- If {path} is not provided, initialize it to an empty list.
- Let {plan} be {\_\_ValuePlan(aether)}.
- Augment {plan} such that:
  - Calls to `plan.get(attr)`:
    - Let {newPath} be a copy of {path} with {attr} appended.
    - Let {value} be `object[attr]`.
    - Return {TrackedObjectPlan(aether, value, constraints, newPath)}.
  - Calls to `plan.evalGet(attr)`:
    - Let {newPath} be a copy of {path} with {attr} appended.
    - Let {value} be `object[attr]`.
    - Add `{type: 'value', path: newPath, value: value}` to {constraints}.
    - Return {value}.
  - Calls to `plan.evalIs(attr, expectedValue)`:
    - Let {newPath} be a copy of {path} with {attr} appended.
    - Let {value} be `object[attr]`.
    - Let {pass} be `value === expectedValue`.
    - Add `{type: 'equal', path: newPath, expectedValue: expectedValue, pass: pass}` to {constraints}.
    - Return {pass}.
  - Calls to `plan.evalHas(attr)`:
    - Let {newPath} be a copy of {path} with {attr} appended.
    - Let {exists} be whether the property `object[attr]` exists ({null} exists, {undefined} does not).
    - Add `{type: 'exists', path: newPath, exists: exists}` to {constraints}.
    - Return {exists}.
  - TODO: split array stuff into separate thing?
  - Calls to `plan.at(idx)`:
    - Let {newPath} be a copy of {path} with {idx} appended.
    - Let {value} be `object[idx]`.
    - Return {TrackedObjectPlan(aether, value, constraints, newPath)}.
  - Calls to `plan.evalAt(idx)`:
    - Let {newPath} be a copy of {path} with {idx} appended.
    - Let {value} be `object[idx]`.
    - Add `{type: 'value', path: newPath, value: value}` to {constraints}.
    - Return {value}.
  - Calls to `plan.evalLength()`:
    - Assert: {object} is an array.
    - Let {length} be the length of the array {object}.
    - Add `{type: 'length', expectedLength: length}` to {constraints}.
    - Return {length}.
- Return {plan}.

Note: a {TrackedObjectPlan()} is a {ValuePlan()} with extra `eval` methods that allow branching the plan formation
during planning. No other plans allow this kind of plan-time branching because planning is synchronous, and
{TrackedObjectPlan()} is the only type that represents these synchronous pieces of data.

InputPlan(aether, inputType, inputValue):

- If {inputValue} is a {Variable}:
  - Let {variableName} be the name of {inputValue}.
  - Return `aether.variablesPlan.get(variableName)`.
- If {inputType} is a non-null type:
  - Let {innerType} be the inner type of {inputType}.
  - Return {InputPlan(aether, innerType, inputValue)}.
- If {inputType} is a List type:
  - Let {innerType} be the inner type of {inputType}.
  - Return {InputListPlan(aether, innerType, inputValue)}.
- If {inputType} is a leaf type:
  - Return {StaticInputLeafPlan(aether, inputValue)}
- Assert {inputType} is an input object type.
- Return {InputObjectPlan(aether, innerType, inputValue)}.

InputListPlan(aether, inputType, inputValue):

- Assert {inputType} is a list type.
- Let {innerType} be the inner type of {inputType}.
- If {innerType} is a non-null type:
  - Return InputListPlan(aether, innerType, inputValue).
- Let {plan} be {NewPlan(aether)}.
- Augment {plan} such that:
  - Calls to `plan.at(index)`:
    - TODO: similar to InputObjectPlan.get
  - Calls to `plan.evalAt(index)`:
    - TODO: similar to InputObjectPlan.evalGet
  - Calls to `plan.evalLength()`:
    - TODO: similar to InputObjectPlan.evalIs
- Return {plan}.

InputObjectPlan(aether, inputType, inputValue):

- Let {plan} be {NewPlan(aether)}.
- Augment {plan} such that:
  - Calls to `plan.get(inputFieldName)`:
    - Let {inputFieldValue} be the value provided in {inputValue} for the name {inputFieldName}.
    - Let {inputFieldDefinition} be the input field defined by {inputType} with the input field name {inputFieldName}.
    - Let {argumentType} be the expected type of {inputFieldDefinition}.
    - Return {InputPlan(aether, argumentType, inputFieldValue)}.
  - Calls to `plan.evalGet(inputFieldName)`:
    - Let {inputFieldValue} be the value provided in {inputValue} for the name {inputFieldName}.
    - If {inputFieldValue} is a {Variable}:
      - Let {variableName} be the name of {inputFieldValue}.
      - Call `aether.variablesPlan.get(variableName)` (note: this is just to track the access, we don't use the result).
    - Otherwise:
      - TODO: if it's an input object (or list thereof), recurse through all layers looking for variables to track.
    - Return the property `inputValue[inputFieldName]`.
  - Calls to `plan.evalIs(inputFieldName, value)`:
    - Let {inputFieldValue} be the value provided in {inputValue} for the name {inputFieldName}.
    - If {inputFieldValue} is a {Variable}:
      - Let {variableName} be the name of {inputFieldValue}.
      - Call `aether.variablesPlan.is(variableName, value)` (note: this is just to track the access, we don't use the
        result).
    - Otherwise:
      - TODO: if it's an input object (or list thereof), recurse through all layers looking for variables to track.
    - Return `value===inputValue[inputFieldName]`.
- Return {plan}.

TrackedArguments(aether, objectType, field):

- Let {variablesPlan} be {aether}.{variablesPlan}.
- Let {argumentValues} be the result of {graphqlCoerceArgumentValues(objectType, field, variablesPlan)}.
- Return an object {trackedObject}, such that:
  - Calls to `trackedObject.get(argumentName)`:
    - Let {argumentValue} be the value provided in {argumentValues} for the name {argumentName}.
    - Let {argumentDefinition} be the argument defined by {field} with the argument name {argumentName}.
    - Let {argumentType} be the expected type of {argumentDefinition}.
    - Return {InputPlan(aether, argumentType, argumentValue)}.
  - Calls to `trackedObject.evalGet(argumentName)`:
    - Let {argumentValue} be the value provided in {argumentValues} for the name {argumentName}.
    - If {argumentValue} is a {Variable}:
      - Let {variableName} be the name of {argumentValue}.
      - Return `aether.variablesPlan.evalGet(variableName)`.
    - Otherwise:
      - TODO: if it's an input object (or list thereof), recurse through all layers looking for variables to track.
      - Return the property `argumentValues[argumentName]`.
  - Calls to `trackedObject.evalIs(argumentName, value)`:
    - Let {argumentValue} be the value provided in {argumentValues} for the name {argumentName}.
    - If {argumentValue} is a {Variable}:
      - Let {variableName} be the name of {argumentValue}.
      - Return `aether.variablesPlan.evalIs(variableName, value)`.
    - Otherwise:
      - TODO: if it's an input object (or list thereof), recurse through all layers looking for variables to track.
      - Return `value===argumentValues[argumentName]`.

Note: Arguments to a field are either static (in which case they're part of the document and will never change within
the same aether) or they are provided via variables. We want to track direct access to the variable type arguments via
{aether}.{variablesPlan}, but access to static arguments does not require any tracking at all.

Note: This recurses - values that are static input objects can contain variables within their descendent fields. If
input object, do recursion, otherwise StaticLeafPlan.

NewPlan(aether):

- Let {plan} be an empty object.
- Let {plan}.{dependencies} be an empty list. (Note: this is plans this plan will need the data from in order to
  execute.)
- Let {plan}.{children} be an empty list. (Note: this is plans that this plan might execute; currently it's the expected
  way that {BranchPlan()} might work.)
- Let {plan}.{finalized} be {false}.
- Let {plan}.{groupId} be {aether}.{groupId}.
- Let {plan}.{id} be the length of {aether}.{plans}.
- Push {plan} onto {aether}.{plans} (Note: it will have {plan}.{id} as its index within {aether}.{plans}).
- Return {plan}.

StaticInputLeafPlan(aether, value):

- Let {plan} be {NewPlan(aether)}.
- Let the internal function provided by {plan} for evaluating the plan, {eval}, be a function that returns {value} for
  each input crystal object.
- Return {plan}.

This represents a static "leaf" value, but will return it via a plan. The plan will always evaluate to the same value.

\_\_ValuePlan(aether):

- Let {plan} be {NewPlan(aether)}.
- Let the internal function provided by {plan} for evaluating the plan, {eval}, be a function that throws an internal
  consistency error.
- Return {plan}.

This represents a concrete object value that'll be passed later; e.g. the result of the parent resolver when the parent
resolver does not return a plan. Like all plans it actually represents a batch of values; you can `.get(attrName)` to
get a plan that resolves to the relevant attribute value from the value plan.

Note: `__ValuePlan` has an underscore prefix since users should never use it; it's an internal plan.

Note: this plan is never executed; it's purely internal - we populate the value as part of the algorithm - see
{GetValuePlanId} and {PopulateValuePlan}.

BranchPlan(aether):

- TODO: this'll allow branching between multiple other plans, e.g. in the case of a union/interface, but also based on
  custom user logic (e.g. fetching different things depending on your billing level, or only showing certain things if
  your authorization allows that).

PlanAetherQuery(aether):

- Let {rootType} be the root Query type in {aether}.{schema}.
- Let {selectionSet} be the top level Selection Set in {aether}.{operation}.
- Let {rootValuePlan} be {aether}.{rootValuePlan}.
- Call {PlanSelectionSet(aether, "", rootValuePlan, rootType, selectionSet)}.

PlanAetherMutation(aether):

- Let {rootType} be the root Mutation type in {aether}.{schema}.
- Let {selectionSet} be the top level Selection Set in {aether}.{operation}.
- Let {rootValuePlan} be {aether}.{rootValuePlan}.
- Call {PlanSelectionSet(aether, "", rootValuePlan, rootType, selectionSet, true)}.

PlanAetherSubscription(aether):

- Let {rootType} be the root Subscription type in {aether}.{schema}.
- Let {selectionSet} be the top level Selection Set in {aether}.{operation}.
- Let {variablesPlan} be {aether}.{variablesPlan}.
- Let {groupedFieldSet} be the result of {graphqlCollectFields(rootType, selectionSet, variablesPlan)}.
- If {groupedFieldSet} does not have exactly one entry, throw a query error.
- Let {fields} be the value of the first entry in {groupedFieldSet}.
- Let {fieldName} be the name of the first entry in {fields}. Note: This value is unaffected if an alias is used.
- Let {field} be the field named {fieldName} on {rootType}.
- Let {subscriptionPlanResolver} be `field.extensions.graphile.subscribePlan`.
- If {subscriptionPlanResolver} exists:
  - Let {trackedArguments} be {TrackedArguments(aether, rootType, field)}.
  - Let {rootValuePlan} be {aether}.{rootValuePlan}.
  - Let {subscribePlan} be {ExecutePlanResolver(aether, subscriptionPlanResolver, rootValuePlan, trackedArguments)}.
  - Call {PlanFieldArguments(aether, field, trackedArguments, subscribePlan)}.
- Otherwise:
  - Let {subscribePlan} be {aether}.{rootValuePlan}.
- Let {aether}.{subscribePlan} be {subscribePlan}.
- Call {PlanSelectionSet(aether, "", subscribePlan, rootType, selectionSet)}.

PlanSelectionSet(aether, path, parentPlan, objectType, selectionSet, isSequential):

- If {isSequential} is not provided, initialize it to {false}.
- Assert: {objectType} is an object type.
- Let {variablesPlan} be {aether}.{variablesPlan}.
- Let {groupedFieldSet} be the result of {graphqlCollectFields(objectType, selectionSet, variablesPlan)} with modified
  algorithm to factor `groupId`/`maxGroupId` in (based on fragments with `@defer`, `@stream`, etc).
- For each {groupedFieldSet} as {responseKey} and {fields}:
  - Let {pathIdentity} be `path + ">" + objectType.name + "." + responseKey`.
  - Let {field} be the first entry in {fields}.
  - If {field} provides the directive `@stream`:
    - Let {oldGroupId} be {aether}.{groupId}.
    - Increment {aether}.{maxGroupId}.
    - Let {aether}.{groupId} be {aether}.{maxGroupId}.
  - Let {fieldName} be the name of {field}. Note: This value is unaffected if an alias is used.
  - Let {fieldType} be the return type defined for the field {fieldName} of {objectType}.
  - Let {planResolver} be `field.extensions.graphile.plan`.
  - If {planResolver} is not {null}:
    - Let {trackedArguments} be {TrackedArguments(aether, objectType, field)}.
    - Let {plan} be {ExecutePlanResolver(aether, planResolver, parentPlan, trackedArguments)}.
    - Call {PlanFieldArguments(aether, field, trackedArguments, plan)}.
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
      - Let {possibleObjectTypes} be all the object types that can be accessed in {subSelectionSet} that are compatible
        with {unwrappedFieldType}.
      - For each {objectType} in {possibleObjectTypes}:
        - Call {PlanSelectionSet(aether, pathIdentity, plan, objectType, subSelectionSet, false)}.
    - Otherwise:
      - Assert: {unwrappedFieldType} is an interface type.
      - If any non-introspection field in {subSelectionSet} is selected on the interface type itself:
        - Let {possibleObjectTypes} be all the object types that implement the {unwrappedFieldType} interface.
        - For each {objectType} in {possibleObjectTypes}:
          - Call {PlanSelectionSet(aether, pathIdentity, plan, objectType, subSelectionSet, false)}.
      - Otherwise:
        - Note: this is the same approach as for union types.
        - Let {possibleObjectTypes} be all the object types that can be accessed in {subSelectionSet} that are
          compatible with {unwrappedFieldType}.
        - For each {objectType} in {possibleObjectTypes}:
          - Call {PlanSelectionSet(aether, pathIdentity, plan, objectType, subSelectionSet, false)}.
  - Let {aether}.{groupId} be {oldGroupId}.
- Return.

PlanFieldArguments(aether, field, trackedArguments, fieldPlan):

- For each argument {argument} in {field}:
  - Let {argumentName} be the name of {argument}.
  - If {trackedArguments} {evalHas} {argumentName}:
    - Let {trackedArgumentValue} be {trackedArguments}.{get(argumentName)}.
    - Call {PlanFieldArgument(aether, argument, trackedArgumentValue, fieldPlan)}.
- Return.

PlanFieldArgument(aether, argument, trackedValuePlan, fieldPlan):

- Let {planResolver} be `argument.extensions.graphile.plan`.
- If {planResolver} exists:
  - Let {argumentPlan} be {ExecutePlanResolver(aether, planResolver, fieldPlan, trackedValuePlan)}.
  - If {argumentPlan} is not {null}:
    - Let {argumentType} be the expected type of {argument}.
    - Call {PlanInput(aether, argumentType, trackedValuePlan, argumentPlan)}.
- Return.

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
  - Let {length} be {trackedArguments}.{evalLength}.
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

PlanInputFields(aether, inputObjectType, trackedValuePlan, parentPlan):

- For each input field {inputField} in {inputObjectType}:
  - Let {fieldName} be the name of {inputField}.
  - If {trackedValuePlan} {evalHas} {fieldName}:
    - Let {trackedFieldValue} be {trackedValuePlan}.{get(fieldName)}.
    - Call {PlanInputField(aether, inputField, trackedFieldValue, fieldPlan)}.
- Return.

PlanInputField(aether, inputField, trackedValuePlan, parentPlan):

- Let {planResolver} be `inputField.extensions.graphile.plan`.
- Assert: {planResolver} exists.
- Let {inputFieldPlan} be {ExecutePlanResolver(aether, planResolver, parentPlan, trackedValuePlan)}.
- If {inputFieldPlan} is not {null}:
  - Let {inputFieldType} be the expected type of {inputField}.
  - Note: the unwrapped type of {inputFieldType} must be an input object.
  - Call {PlanInput(aether, inputFieldType, trackedValuePlan, inputFieldPlan)}.
- Return.

ExecutePlanResolver(aether, planResolver, parentPlan, trackedArguments):

- Let {plan} be the result of calling {planResolver}, providing {parentPlan}, {trackedArguments},
  {aether}.{trackedContext}.
- Return {plan}.

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

GetValuePlanId(aether, valuePlan, object):

- Assert: {valuePlan} is a {\_\_ValuePlan}.
- Let {valueIdByObject} be the map for {valuePlan}.{id} within the map {aether}.{valueIdByObjectByPlanId} (creating the
  entry if necessary).
- Let {parentId} be the value for {object} within the map {valueIdByObject}.
- If {valueId} is set:
  - Return {valueId}.
- Otherwise:
  - Let {valueId} be a new unique id.
  - Call {PopulateValuePlan(crystalContext, valuePlan, valueId, object)}. (Note: this populates the {\_\_ValuePlan} for
    this specific parent.)
  - Set {valueId} as the value for {object} in {valueIdByObject}.
  - Return {valueId}.

ResolveFieldValueCrystal(schema, document, operationName, variableValues, context, rootValue, field, parentObject,
argumentValues, pathIdentity):

- Let {fieldName} be the name of {field}.
- Let {objectType} be the object type on which {field} is defined.
- Let {returnType} be the expected type of {field}.
- Let {aether} be {EstablishAether(schema, document, operationName, variableValues, context, rootValue)}.
- Let {planId} be the value for key {pathIdentity} within {aether}.{planIdByPathIdentity}.
- Let {plan} be the plan at index {planId} within {aether}.{plans}.
- If {plan} is null:
  - If {parentObject} is a crystal wrapped value:
    - Let {objectValue} be the data within {parentObject}.
  - Otherwise:
    - Let {objectValue} be {parentObject}.
  - Return {graphqlResolveFieldValue(objectType, objectValue, fieldName, argumentValues)}.
- Otherwise:
  - Let {id} be a new unique id.
  - Let {batch} be {GetBatch(aether, pathIdentity, parentCrystalObject, variableValues, context, rootValue)}.
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
  - Return {CrystalWrap(plan, returnType, parentCrystalObject, pathIdentity, id, result)}.

CrystalWrap(plan, returnType, parentCrystalObject, pathIdentity, id, data, indexes):

- If {indexes} is not set, initialize it to an empty list.
- If {data} is {null}:
  - Return {null}.
- Otherwise, if {returnType} is a non-null type:
  - Let {innerType} be the inner type of {returnType}.
  - Return {CrystalWrap(plan, innerType, parentCrystalObject, pathIdentity, id, data)}.
- Otherwise, if {returnType} is a list type:
  - Let {innerType} be the inner type of {returnType}.
  - Let {result} be an empty list.
  - For each {entry} with index {index} in {data}:
    - Let {wrappedIndexes} be a list composed of everything in {indexes} followed by {index}.
    - Let {wrappedEntry} be {CrystalWrap(plan, innerType, parentCrystalObject, pathIdentity, id, entry, indexes)}.
    - Push {wrappedEntry} onto {result}.
  - Return {result}.
- Otherwise:
  - If {parentCrystalObject} is provided:
    - Let {crystalContext} be a reference to {parentCrystalObject}'s {crystalContext}.
    - Let {idByPathIdentity} be a reference to {parentCrystalObject}'s {idByPathIdentity}.
    - Let {indexesByPathIdentity} be a reference to {parentCrystalObject}'s {indexesByPathIdentity}.
  - Let {crystalObject} be {NewCrystalObject(plan, pathIdentity, id, indexes, data, crystalContext, idByPathIdentity,
    indexesByPathIdentity)}.
  - Return {crystalObject}.

NewCrystalObject(plan, pathIdentity, id, indexes, data, crystalContext, idByPathIdentity, indexesByPathIdentity):

- If {idByPathIdentity} is not set, initialize it to a map containing value {crystalContext}.{rootId} for key `""`.
- If {indexesByPathIdentity} is not set, initialize it to a map containing an empty list value for key `""`.
- Let {crystalObject} be an empty object.
- Let {crystalObject}.{crystalContext} be a reference to {crystalContext}.
- Let {crystalObject}.{idByPathIdentity} be an independent copy of {idByPathIdentity}.
- Let {crystalObject}.{indexesByPathIdentity} be an independent copy of {indexesByPathIdentity}.
- Set {id} as the value for key {pathIdentity} within {crystalObject}.{idByPathIdentity}.
- Set {indexes} as the value for key {pathIdentity} within {crystalObject}.{indexesByPathIdentity}.
- Return {crystalObject}.

NewCrystalContext(aether, variableValues, context, rootValue):

- Let {crystalContext} be an empty object.
- Let {crystalContext}.{resultByIdByPlan} be an empty map.
- Let {crystalContext}.{metaByPlan} be an empty map.
- Let {rootId} be a new unique id.
- Let {crystalContext}.{rootId} be {rootId}.
- Let {variablesPlan} be {aether}.{variablesPlan}.
- Call {PopulateValuePlan(crystalContext, variablesPlan, rootId, variableValues)}.
- Let {contextPlan} be {aether}.{contextPlan}.
- Call {PopulateValuePlan(crystalContext, contextPlan, rootId, context)}.
- Let {rootValuePlan} be {aether}.{rootValuePlan}.
- Call {PopulateValuePlan(crystalContext, rootValuePlan, rootId, rootValue)}.
- Return {crystalContext}.

PopulateValuePlan(crystalContext, valuePlan, valueId, object):

- Set {object} as the value for entry {valueId} for entry {valuePlan} in {crystalContext}.{resultByIdByPlan}.

GetBatch(aether, pathIdentity, parentCrystalObject, variableValues, context, rootValue):

- Let {batch} be the value for key {pathIdentity} within {aether}.{batchByPathIdentity}.
- If {batch} is null:
  - If {parentCrystalObject} is not null:
    - Let {crystalContext} be {parentCrystalObject}.{crystalContext}.
  - Otherwise:
    - Let {crystalContext} be {NewCrystalContext(aether, variableValues, context, rootValue)}.
  - Let {batch} be {NewBatch(aether, pathIdentity, crystalContext)}.
  - Set {batch} as the value for key {pathIdentity} within {aether}.{batchByPathIdentity}.
  - Schedule {ExecuteBatch(aether, batch, crystalContext)} to occur soon (but asynchronously). (Note: when batch is
    executed it will delete itself from aether.batchByPathIdentity.)
- Return {batch}.

NewBatch(aether, pathIdentity, crystalContext):

- Let {batch} be an empty object.
- Let {batch}.{pathIdentity} be {pathIdentity}.
- Let {batch}.{crystalContext} be {crystalContext}.
- Let {planId} be the value for key {pathIdentity} within {aether}.{planIdByPathIdentity}.
- Let {plan} be the plan at index {planId} within {aether}.{plans}.
- Let {batch}.{plan} be {plan}.
- Let {batch}.{entries} be an empty list.
- Return {batch}.

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

GetBatchResult(batch, parentCrystalObject):

- Let {deferredResult} be a new {Defer}.
- Push the tuple `[parentCrystalObject, deferredResult]` onto {batch}.{entries}.
- Return {deferredResult}.

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
  - Let {eval} be the internal function provided by {plan} for evaluating the plan.
  - Let {meta} be the entry for {plan} within {crystalContext}.{metaByPlan}.
  - Let {pendingResult} be the result of calling {eval}, providing {values} and {meta}. (Note: the `eval` method on
    plans is responsible for memoizing results into {meta}.)
  - Assert the length of {pendingResult} should match the length of {pendingCrystalObjects}.
  - For each {pendingCrystalObject} with index {i} in {pendingCrystalObjects}:
    - Let {pendingResult} be the {i}th value in {pendingResult}.
    - Let {j} be the index of {pendingCrystalObject} within {crystalObjects}.
    - Set the value for key {pendingCrystalObject}.{id} for key {plan} in {crystalContext}.{resultByIdByPlan} to
      {pendingResult}.
    - Set {pendingResult} as the {j}th value of {result}.
- Return {result}.
