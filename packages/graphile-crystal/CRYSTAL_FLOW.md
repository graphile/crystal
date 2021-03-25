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
however you will be given a {TrackedObject()} rather than the direct {variable}, {context} and {rootValue} values; so
you need to access the properties using `.get` or `.is`. To reduce noise, we've not yet included these updated
algorithms in this spec.

The first thing we need to do is call {EstablishAether()} to get the aether within which the operation will execute;
this will also involve performing the planning if it hasn't already been done. Once we have the aether we can move on to
the execution phase.

{globalCache} is a global cache for performance.

EstablishAether(schema, document, operationName, variables, context, rootValue):

- Let {matchingAethers} be all the Aethers in {globalCache}.
- For each {possibleAether} in {matchingAethers}:
  - If {IsAetherCompatible(possibleAether, schema, document, operationName, variables, context, rootValue)}:
    - Return {possibleAether}.
- Let {aether} be the result of calling {NewAether(schema, document, operationName, variables, context, rootValue)}.
- Store {aether} into {globalCache} (temporarily).
- Return {aether}.

IsAetherCompatible(aether, schema, document, operationName, variables, context, rootValue):

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

- Let {aether.plans} be an empty list.
- Let {aether.parentPlanByPathIdentity} be an empty object.
- Let {aether.planByPathIdentity} be an empty object.

- Let {aether.variablePlan} be {ValuePlan(aether)}.
- Let {aether.variableConstraints} be an empty object.
- Let {aether.trackedVariables} be {TrackedObject(variables, aether.variableConstraints, aether.variablePlan)}.

- Let {aether.contextPlan} be {ValuePlan(aether)}.
- Let {aether.contextConstraints} be an empty object.
- Let {aether.trackedContext} be {TrackedObject(context, aether.contextConstraints, aether.contextPlan)}.

- Let {aether.rootValuePlan} be {ValuePlan(aether)}.
- Let {aether.rootValueConstraints} be an empty object.
- Let {aether.trackedRootValue} be {TrackedObject(rootValue, aether.rootValueConstraints, aether.rootValuePlan)}.

- Let {aether.subscribePlan} be {null}.
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

TrackedObject(object, constraints, plan):

- Return an object {p}, such that:
  - Calls to {p.get(attr)}:
    - Return {plan.get(attr)}.
  - Calls to {p.evalGet(attr)}:
    - Add `{type:'value',value:object[attr]}` to {constraints}.
    - Return the property {object[attr]}.
  - Calls to {p.evalIs(attr, value)}:
    - Add `{type:'equal',value:value,pass:value===object[attr]}` to {constraints}.
    - Return {value===object[attr]}.

InputPlan(aether, inputType, inputValue):

- If {inputValue} is a {Variable}:
  - Let {variableName} be the name of {inputValue}.
  - Return {aether.variablePlan.get(variableName)}.
- If {inputType} is a non-null type:
  - Let {innerType} be the inner type of {inputType}.
  - Return {InputPlan(aether, innerType, inputValue)}.
- If {inputType} is a List type:
  - Let {innerType} be the inner type of {inputType}.
  - Return {InputListPlan(aether, innerType, inputValue}.
- If {inputType} is a leaf type:
  - Return {StaticInputLeafPlan(aether, inputValue)}
- Assert {inputType} is an input object type.
- Return {InputObjectPlan(aether, innerType, inputValue)}.

InputListPlan(aether, inputType, inputValue):

- Assert {inputType} is a list type.
- Let {innerType} be the inner type of {inputType}.
- If {innerType} is a non-null type:
  - Return InputListPlan(aether, innerType, inputValue).
- Return an object {p}, such that:
  - Calls to {p.at(index)}:
    - TODO: similar to InputObjectPlan.get
  - Calls to {p.evalAt(index)}:
    - TODO: similar to InputObjectPlan.evalGet
  - Calls to {p.evalLength()}:
    - TODO: similar to InputObjectPlan.evalIs

InputObjectPlan(aether, inputType, inputValue):

- Return an object {p}, such that:
  - Calls to {p.get(inputFieldName)}:
    - Let {inputFieldValue} be the value provided in {inputValue} for the name {inputFieldName}.
    - Let {inputFieldDefinition} be the input field defined by {inputType} with the input field name {inputFieldName}.
    - Let {argumentType} be the expected type of {inputFieldDefinition}.
    - Return {InputPlan(aether, argumentType, inputFieldValue)
  - Calls to {p.evalGet(inputFieldName)}:
    - Let {inputFieldValue} be the value provided in {inputValue} for the name {inputFieldName}.
    - If {inputFieldValue} is a {Variable}:
      - Let {variableName} be the name of {inputFieldValue}.
      - Call {aether.trackedVariables.get(variableName)} (note: this is just to track the access, we don't use the
        result).
    - Otherwise:
      - TODO: if it's an input object (or list thereof), recurse through all layers looking for variables to track.
    - Return the property {inputValue[inputFieldName]}.
  - Calls to {p.evalIs(inputFieldName, value)}:
    - Let {inputFieldValue} be the value provided in {inputValue} for the name {inputFieldName}.
    - If {inputFieldValue} is a {Variable}:
      - Let {variableName} be the name of {inputFieldValue}.
      - Call {aether.trackedVariables.is(variableName, value)} (note: this is just to track the access, we don't use the
        result).
    - Otherwise:
      - TODO: if it's an input object (or list thereof), recurse through all layers looking for variables to track.
    - Return {value===inputValue[inputFieldName]}.

TrackedArguments(aether, objectType, field):

- Let {argumentValues} be the result of {graphql.CoerceArgumentValues(objectType, field, aether.trackedVariables)}.
- Return an object {p}, such that:
  - Calls to {p.get(argumentName)}:
    - Let {argumentValue} be the value provided in {argumentValues} for the name {argumentName}.
    - Let {argumentDefinition} be the argument defined by {field} with the argument name {argumentName}.
    - Let {argumentType} be the expected type of {argumentDefinition}.
    - Return {InputPlan(aether, argumentType, argumentValue)
  - Calls to {p.evalGet(argumentName)}:
    - Let {argumentValue} be the value provided in {argumentValues} for the name {argumentName}.
    - If {argumentValue} is a {Variable}:
      - Let {variableName} be the name of {argumentValue}.
      - Call {aether.trackedVariables.get(variableName)} (note: this is just to track the access, we don't use the
        result).
    - Otherwise:
      - TODO: if it's an input object (or list thereof), recurse through all layers looking for variables to track.
    - Return the property {argumentValues[argumentName]}.
  - Calls to {p.evalIs(argumentName, value)}:
    - Let {argumentValue} be the value provided in {argumentValues} for the name {argumentName}.
    - If {argumentValue} is a {Variable}:
      - Let {variableName} be the name of {argumentValue}.
      - Call {aether.trackedVariables.is(variableName, value)} (note: this is just to track the access, we don't use the
        result).
    - Otherwise:
      - TODO: if it's an input object (or list thereof), recurse through all layers looking for variables to track.
    - Return {value===argumentValues[argumentName]}.

Note: arguments to a field are either static (in which case they're part of the document and will never change within
the same aether) or they are provided via variables. We want to track direct access to the variable type arguments via
{aether.trackedVariables}, but access to static arguments does not require any tracking at all.

Note: this recurses - values that are static input objects can contain variables within their descendent fields. If
input object, do recursion, otherwise StaticLeafPlan.

Plan(aether):

- Let {plan} be an empty object.
- Let {plan.dependencies} be an empty list.
- Let {plan.finalized} be {false}.
- Let {plan.id} be the length of {aether.plans}.
- Push {plan} onto {aether.plans} (Note: it will have {plan.id} as its index within {aether.plans}).
- Return {plan}.

StaticInputLeafPlan(aether, value):

- Let {plan} be a new {Plan(aether)}.
- TODO: this represents a static "leaf" value, but will return it via a plan. The plan will always evaluate to the same
  value.

ValuePlan(aether):

- Let {plan} be a new {Plan(aether)}.
- TODO: this represents a concrete object value that'll be passed later; e.g. the result of the parent resolver when the
  parent resolver does not return a plan. Like all plans it actually represents a batch of values; you can
  `.get(attrName)` to get a plan that resolves to the relevant attribute value from the value plan.

PlanAetherQuery(aether):

- Let {rootType} be the root Query type in {aether.schema}.
- Let {selectionSet} be the top level Selection Set in {aether.operation}.
- Call {PlanSelectionSet(aether, "", aether.rootPlan, rootType, selectionSet)}.

PlanAetherMutation(aether):

- Let {rootType} be the root Mutation type in {aether.schema}.
- Let {selectionSet} be the top level Selection Set in {aether.operation}.
- Call {PlanSelectionSet(aether, "", aether.rootPlan, rootType, selectionSet, true)}.

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
  - Let {trackedArguments} be {TrackedArguments(aether, rootType, field)}.
  - Let {aether.subscribePlan} be {ExecutePlanResolver(aether, subscriptionPlanResolver, aether.rootPlan,
    trackedArguments)}.
  - Call {PlanFieldArguments(aether, field, trackedArguments, aether.subscribePlan)}.
- Call {PlanSelectionSet(aether, "", aether.subscribePlan, rootType, selectionSet)}.

TODO: should we be passing aether.subscribePlan here? Something else?

PlanSelectionSet(aether, path, parentPlan, objectType, selectionSet, isSequential):

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
    - Let {trackedArguments} be {TrackedArguments(aether, objectType, field)}.
    - Let {plan} be {ExecutePlanResolver(aether, planResolver, parentPlan, trackedArguments)}.
    - Set {plan} as the value for {pathIdentity} in {aether.planByPathIdentity}.
    - Call {PlanFieldArguments(aether, field, trackedArguments, plan)}.
  - Otherwise:
    - Let {plan} be {ValuePlan(aether)}.
  - Let {unwrappedFieldType} be the named type of {fieldType}.
  - TODO: what do list types mean for plans?
  - If {unwrappedFieldType} is an Object, Interface or Union type:
    - Let {subSelectionSet} be the result of calling {graphql.MergeSelectionSets(fields)}.
    - If {unwrappedFieldType} is an object type:
      - Call {PlanSelectionSet(aether, pathIdentity, plan, unwrappedFieldType, subSelectionSet, false).
    - Otherwise, if {unwrappedFieldType} is a union type:
      - Let {possibleObjectTypes} be all the object types that can be accessed in {subSelectionSet} that are compatible
        with {unwrappedFieldType}.
      - For each {objectType} in {possibleObjectTypes}:
        - Call {PlanSelectionSet(aether, pathIdentity, plan, objectType, subSelectionSet, false).
    - Otherwise:
      - Assert: {unwrappedFieldType} is an interface type.
      - If any non-introspection field in {subSelectionSet} is selected on the interface type itself:
        - Let {possibleObjectTypes} be all the object types that implement the {unwrappedFieldType} interface.
        - For each {objectType} in {possibleObjectTypes}:
          - Call {PlanSelectionSet(aether, pathIdentity, plan, objectType, subSelectionSet, false).
      - Otherwise:
        - Note: this is the same approach as for union types.
        - Let {possibleObjectTypes} be all the object types that can be accessed in {subSelectionSet} that are
          compatible with {unwrappedFieldType}.
        - For each {objectType} in {possibleObjectTypes}:
          - Call {PlanSelectionSet(aether, pathIdentity, plan, objectType, subSelectionSet, false).
  - Return.

PlanFieldArguments(aether, field, trackedArguments, fieldPlan):

- TODO: ... then call PlanInputFields as appropriate

PlanInputFields(aether, inputObjectType, trackedValues, parentPlan):

- TODO

ExecutePlanResolver(aether, planResolver, parentPlan, trackedArguments):

- Let {plan} be the result of calling {planResolver}, providing {parentPlan}, {trackedArguments},
  {aether.trackedContext}.
- Return {plan}.

## Step 2: execution phase

We're in a GraphQL resolver. We don't know what's going on, but we've been given a parent object (which may or may not
be crystal-related), arguments (which will be identical for all of our counterparts), context (which will be identical
for all of our counterparts) and details of the GraphQL schema, the document and operationName being executed, the
variables provided, the rootValue provided, and our position within the operation.

The first thing we need to do is figure out our aether, {aether}, via {EstablishAether()}.

Next we figure out our path identity, {pathIdentity}, within the operation.

Next we find the plan for ourself, {plan}, by looking for the {pathIdentity} entry in {aether.planByPathIdentity}.

If there's no plan, we just call through to the underlying resolver and we're done. Otherwise...

If we're a "plan root" (that is to say, our parent field doesn't have a plan) then... Nothing special happens? Just
continue as normal.

We must execute the plan passing the relevant information. Note that, if we have any, our counterparts will be doing
this too, in parallel, and the plan should batch all these calls together into a `Batch` so that only one request needs
to be made to the underlying data store.

If executing the plan results in an error, throw the error. Otherwise we should wrap the result up into a object
(keeping track of all the previous values too (see the parent object), perhaps using their plan id?) which we then pass
through to the underlying resolver.

NOTE: in a divergence from GraphQL proper, _sibling_ resolvers will not receive the same parent object - each resolver
receives data customised to that specific field.

ResolveFieldValueCrystal(schema, document, operationName, variables, context, rootValue, field, alias, parentObject,
argumentValues, pathIdentity):

- Let {fieldName} be the name of {field}.
- Let {objectType} be the object type on which {field} is defined.
- Let {resultType} be the expected type of {field}.
- Let {aether} be {EstablishAether(schema, document, operationName, variables, context, rootValue)}.
- Let {plan} be the plan for {pathIdentity} within {aether.planByPathIdentity}.
- If {plan} is null:
  - If {parentObject} is a crystal wrapped value:
    - Let {data} be the data within {parentObject}.
    - Let {objectValue} be an object containing one key {fieldName} with the value {data}.
  - Otherwise:
    - Let {objectValue} be {parentObject}.
  - Return {graphql.ResolveFieldValue(objectType, objectValue, fieldName, argumentValues)}.
- Otherwise:
  - Let {batch} be {GetBatch(aether, pathIdentity)}.
  - Let {id} be a new unique id.
  - If {parentObject} is a crystalObject:
    - Let {crystalObject} be {parentObject}.
  - Otherwise:
    - Let {crystalObject} be {NewCrystalObject(... parentObject ...)}.
  - Let {result} be {GetBatchResult(batch, crystalObject)} (note: could be asynchronous).
  - Return {CrystalWrap(resultType, parentObject, pathIdentity, id, result)}.

CrystalWrap(resultType, parentObject, pathIdentity, id, data):

- If {data} is {null}:
  - Return {null}.
- Otherwise, if {resultType} is a non-null type:
  - Let {innerType} be the inner type of {resultType}.
  - Return {CrystalWrap(innerType, parentObject, pathIdentity, id, data)}.
- Otherwise, if {resultType} is a list type:
  - Let {innerType} be the inner type of {resultType}.
  - Let {result} be an empty list.
  - For each {entry} in {data}:
    - Let {wrappedEntry} be {CrystalWrap(innerType, parentObject, pathIdentity, id, entry)}.
    - Push {wrappedEntry} onto {result}.
  - Return {result}.
- Otherwise:
  - Let {crystalObject} be {NewCrystalObject(aether, pathIdentity, parentObject, id)}.
  - Return {crystalObject}.

NewCrystalObject(aether, pathIdentity, parentObject, id):

- Let {crystalObject} be an empty object.
- If {parentObject} is a crystal object:
  - Let {crystalObject.resultByIdByPlan} be a reference to {parentObject.resultByIdByPlan}.
  - Let {crystalObject.idByPathIdentity} be a copy of {parentObject.idByPathIdentity}.
- Otherwise:
  - Let {crystalObject.resultByIdByPlan} be an empty map.
  - Let {crystalObject.idByPathIdentity} be an empty map.
  - Set the value for key {pathIdentity} within {aether.parentPlanByPathIdentity} to {parentPlan}.
  - Set the value for key {id} for key {parentPlan} in {crystalObject.resultByIdByPlan} to {parentObject} (note: this
    fakes execution of this "plan").
- Set {id} as the value for key {pathIdentity} within {crystalObject.idByPathIdentity}.
- Return {crystalObject}.

GetBatch(aether, pathIdentity):

- Let {batch} be the value for key {pathIdentity} within {aether.batchByPathIdentity}.
- If {batch} is null:
  - Let {batch} be {NewBatch(aether, pathIdentity)}.
  - Set {batch} as the value for key {pathIdentity} within {aether.batchByPathIdentity}.
- Return {batch}.

NewBatch(aether, pathIdentity):

- Let {batch} be an empty object.
- Let {batch.pathIdentity} be {pathIdentity}.
- Let {batch.plan} be the value for key {pathIdentity} within {aether.planByPathIdentity}.
- Let {batch.entries} be an empty list.
- Schedule {ExecuteBatch(aether, batch)} to occur soon (but asynchronously).
- Return {batch}.

ExecuteBatch(aether, batch):

- Delete the value for key {batch.pathIdentity} within {aether.batchByPathIdentity} (Note: this means a new batch will
  be used for later calls).
- Let {crystalObjects} be the first entry in each tuple within {batch.entries}.
- Let {deferredResults} be the second entry in each tuple within {batch.entries}.
- Let {results} be the result of calling (asynchronously if necessary) {ExecutePlan(aether, batch.plan,
  crystalObjects)}.
- Assert that the length of {results} matches the length of {deferredResults}.
- For each {deferredResult} with index {i} in {deferredResults}:
  - Resolve {deferredResult} with the {i}th entry in {results}.
- Return.

GetBatchResult(batch, parentCrystalObject, id):

- Let {deferredResult} be a new {Defer}.
- Push the tuple {[parentCrystalObject, id, deferredResult]} onto {batch.entries}.
- Return {deferredResult}.
