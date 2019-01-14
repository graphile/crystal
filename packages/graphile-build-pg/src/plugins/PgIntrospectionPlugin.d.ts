export interface PgNamespace {
  kind: "namespace";
  id: string;
  name: string;
  comment: string | void;
  description: string | void;
  tags: { [tag: string]: true | string | Array<string> };
}

export interface PgProc {
  kind: "procedure";
  id: string;
  name: string;
  comment: string | void;
  description: string | void;
  namespaceId: string;
  namespaceName: string;
  isStrict: boolean;
  returnsSet: boolean;
  isStable: boolean;
  returnTypeId: string;
  argTypeIds: Array<string>;
  argNames: Array<string>;
  argModes: Array<"i" | "o" | "b" | "v" | "t">;
  inputArgsCount: number;
  argDefaultsNum: number;
  namespace: PgNamespace;
  tags: { [tag: string]: true | string | Array<string> };
  cost: number;
  aclExecutable: boolean;
}

export interface PgClass {
  kind: "class";
  id: string;
  name: string;
  comment: string | void;
  description: string | void;
  classKind: string;
  namespaceId: string;
  namespaceName: string;
  typeId: string;
  isSelectable: boolean;
  isInsertable: boolean;
  isUpdatable: boolean;
  isDeletable: boolean;
  isExtensionConfigurationTable: boolean;
  namespace: PgNamespace;
  type: PgType;
  tags: { [tag: string]: boolean | string | Array<string> };
  attributes: [PgAttribute];
  constraints: [PgConstraint];
  foreignConstraints: [PgConstraint];
  primaryKeyConstraint: PgConstraint | void;
  aclSelectable: boolean;
  aclInsertable: boolean;
  aclUpdatable: boolean;
  aclDeletable: boolean;
}

export interface PgType {
  kind: "type";
  id: string;
  name: string;
  comment: string | void;
  description: string | void;
  namespaceId: string;
  namespaceName: string;
  type: string;
  category: string;
  domainIsNotNull: boolean;
  arrayItemTypeId: string | void;
  arrayItemType: PgType | void;
  arrayType: PgType | void;
  typeLength: number | void;
  isPgArray: boolean;
  classId: string | void;
  domainBaseTypeId: string | void;
  domainTypeModifier: number | void;
  tags: { [tag: string]: true | string | Array<string> };
}

export interface PgAttribute {
  kind: "attribute";
  classId: string;
  num: number;
  name: string;
  comment: string | void;
  description: string | void;
  typeId: string;
  typeModifier: number;
  isNotNull: boolean;
  hasDefault: boolean;
  identity: "" | "a" | "d";
  class: PgClass;
  type: PgType;
  namespace: PgNamespace;
  tags: { [tag: string]: true | string | Array<string> };
  aclSelectable: boolean;
  aclInsertable: boolean;
  aclUpdatable: boolean;
  isIndexed: boolean | void;
  isUnique: boolean | void;
}

export interface PgConstraint {
  kind: "constraint";
  id: string;
  name: string;
  type: string;
  classId: string;
  class: PgClass;
  foreignClassId: string | void;
  comment: string | void;
  description: string | void;
  keyAttributeNums: Array<number>;
  keyAttributes: Array<PgAttribute>;
  foreignKeyAttributeNums: Array<number>;
  foreignKeyAttributes: Array<PgAttribute>;
  namespace: PgNamespace;
  isIndexed: boolean | void;
  tags: { [tag: string]: true | string | Array<string> };
}

export interface PgExtension {
  kind: "extension";
  id: string;
  name: string;
  namespaceId: string;
  relocatable: boolean;
  version: string;
  configurationClassIds?: Array<string>;
  comment: string | void;
  description: string | void;
  tags: { [tag: string]: true | string | Array<string> };
}

export interface PgIndex {
  kind: "index";
  id: string;
  name: string;
  namespaceName: string;
  classId: string;
  numberOfAttributes: number;
  indexType: string;
  isUnique: boolean;
  isPrimary: boolean;
  attributeNums: Array<number>;
  attributePropertiesAsc: Array<boolean> | void;
  attributePropertiesNullsFirst: Array<boolean> | void;
  description: string | void;
  tags: { [tag: string]: true | string | Array<string> };
}

export type PgEntity =
  | PgNamespace
  | PgProc
  | PgClass
  | PgType
  | PgAttribute
  | PgConstraint
  | PgExtension
  | PgIndex;
