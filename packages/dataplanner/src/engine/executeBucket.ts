import type { DocumentNode, FieldNode } from "graphql";
import { executeSync } from "graphql";
import { graphqlSync, OperationDefinitionNode } from "graphql";
import { Kind, OperationTypeNode } from "graphql";
import { inspect } from "util";

import type { Bucket, BucketPath, RequestContext } from "../bucket";
import type { CrystalError } from "../error";
import { newCrystalError } from "../error";
import { newNonNullError } from "../error";
import { isCrystalError } from "../error";
import { $$concreteType, $$idempotent } from "../interfaces";
import { isPolymorphicData } from "../polymorphic";
import { arrayOfLength } from "../utils";
import type { OutputPath } from "./executeOutputPlan";
import { LayerPlanReason } from "./LayerPlan";
import type { MetaByStepId, OperationPlan } from "./OperationPlan";
import type { OutputPlanChild } from "./OutputPlan";

/** @internal */
export async function executeBucket(
  bucket: Bucket,
  metaByStepId: MetaByStepId,
  requestContext: RequestContext,
): Promise<void> {}
