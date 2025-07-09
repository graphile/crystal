import { PgExecutor } from "@dataplan/pg";
import type { PromiseOrDirect } from "grafast";
import type { Introspection, PgAttribute, PgAuthMembers, PgClass, PgConstraint, PgDepend, PgDescription, PgEnum, PgExtension, PgIndex, PgInherits, PgLanguage, PgNamespace, PgProc, PgRange, PgRoles, PgType } from "pg-introspection";
export type PgEntityWithId = PgNamespace | PgClass | PgConstraint | PgProc | PgRoles | PgType | PgEnum | PgExtension | PgExtension | PgIndex | PgLanguage;
declare global {
    namespace GraphileBuild {
        interface GatherOptions {
            /**
             * Should we attempt to install the watch fixtures into the database?
             *
             * Default: true
             */
            installWatchFixtures?: boolean;
        }
    }
    namespace GraphileConfig {
        interface Plugins {
            PgIntrospectionPlugin: true;
        }
        interface GatherHelpers {
            pgIntrospection: {
                getIntrospection(): PromiseOrDirect<IntrospectionResults>;
                getService(serviceName: string): Promise<{
                    introspection: Introspection;
                    pgService: GraphileConfig.PgServiceConfiguration;
                }>;
                getExecutorForService(serviceName: string): PgExecutor;
                getNamespace(serviceName: string, id: string): Promise<PgNamespace | undefined>;
                getClasses(serviceName: string): Promise<PgClass[]>;
                getClass(serviceName: string, id: string): Promise<PgClass | undefined>;
                getConstraint(serviceName: string, id: string): Promise<PgConstraint | undefined>;
                getProc(serviceName: string, id: string): Promise<PgProc | undefined>;
                getRoles(serviceName: string, id: string): Promise<PgRoles | undefined>;
                getType(serviceName: string, id: string): Promise<PgType | undefined>;
                getEnum(serviceName: string, id: string): Promise<PgEnum | undefined>;
                getExtension(serviceName: string, id: string): Promise<PgExtension | undefined>;
                getIndex(serviceName: string, id: string): Promise<PgIndex | undefined>;
                getLanguage(serviceName: string, id: string): Promise<PgLanguage | undefined>;
                getAttribute(serviceName: string, classId: string, attributeNumber: number): Promise<PgAttribute | undefined>;
                getAttributesForClass(serviceName: string, classId: string): Promise<PgAttribute[]>;
                getConstraintsForClass(serviceName: string, classId: string): Promise<PgConstraint[]>;
                getForeignConstraintsForClass(serviceName: string, classId: string): Promise<PgConstraint[]>;
                getInheritedForClass(serviceName: string, classId: string): Promise<PgInherits[]>;
                getNamespaceByName(serviceName: string, namespaceName: string): Promise<PgNamespace | undefined>;
                getClassByName(serviceName: string, namespaceName: string, tableName: string): Promise<PgClass | undefined>;
                getTypeByName(serviceName: string, namespaceName: string, typeName: string): Promise<PgType | undefined>;
                getTypeByArray(serviceName: string, arrayId: string): Promise<PgType | undefined>;
                getEnumsForType(serviceName: string, typeId: string): Promise<PgEnum[]>;
                getRangeByType(serviceName: string, typeId: string): Promise<PgRange | undefined>;
                getExtensionByName(serviceName: string, extensionName: string): Promise<PgExtension | undefined>;
            };
        }
        interface GatherHooks {
            pgIntrospection_introspection(event: {
                introspection: Introspection;
                serviceName: string;
            }): PromiseOrDirect<void>;
            pgIntrospection_namespace(event: {
                entity: PgNamespace;
                serviceName: string;
            }): PromiseOrDirect<void>;
            pgIntrospection_class(event: {
                entity: PgClass;
                serviceName: string;
            }): PromiseOrDirect<void>;
            pgIntrospection_attribute(event: {
                entity: PgAttribute;
                serviceName: string;
            }): PromiseOrDirect<void>;
            pgIntrospection_constraint(event: {
                entity: PgConstraint;
                serviceName: string;
            }): PromiseOrDirect<void>;
            pgIntrospection_proc(event: {
                entity: PgProc;
                serviceName: string;
            }): PromiseOrDirect<void>;
            pgIntrospection_role(event: {
                entity: PgRoles;
                serviceName: string;
            }): PromiseOrDirect<void>;
            pgIntrospection_auth_member(event: {
                entity: PgAuthMembers;
                serviceName: string;
            }): PromiseOrDirect<void>;
            pgIntrospection_type(event: {
                entity: PgType;
                serviceName: string;
            }): PromiseOrDirect<void>;
            pgIntrospection_enum(event: {
                entity: PgEnum;
                serviceName: string;
            }): PromiseOrDirect<void>;
            pgIntrospection_extension(event: {
                entity: PgExtension;
                serviceName: string;
            }): PromiseOrDirect<void>;
            pgIntrospection_index(event: {
                entity: PgIndex;
                serviceName: string;
            }): PromiseOrDirect<void>;
            pgIntrospection_language(event: {
                entity: PgLanguage;
                serviceName: string;
            }): PromiseOrDirect<void>;
            pgIntrospection_range(event: {
                entity: PgRange;
                serviceName: string;
            }): PromiseOrDirect<void>;
            pgIntrospection_depend(event: {
                entity: PgDepend;
                serviceName: string;
            }): PromiseOrDirect<void>;
            pgIntrospection_description(event: {
                entity: PgDescription;
                serviceName: string;
            }): PromiseOrDirect<void>;
        }
    }
}
type IntrospectionResults = Array<{
    pgService: GraphileConfig.PgServiceConfiguration;
    introspection: Introspection;
}>;
export declare const PgIntrospectionPlugin: GraphileConfig.Plugin;
export {};
//# sourceMappingURL=PgIntrospectionPlugin.d.ts.map