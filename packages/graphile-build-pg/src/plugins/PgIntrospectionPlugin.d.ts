export interface PgNamespace {
  kind: "namespace";
  id: string;
  name: string;
  description: string | void;
  tags: { [tag: string]: string };
}

export interface PgProc {
  kind: "procedure";
  name: string;
  description: string | void;
  namespaceId: string;
  isStrict: boolean;
  returnsSet: boolean;
  isStable: boolean;
  returnTypeId: string;
  argTypeIds: Array<string>;
  argNames: Array<string>;
  argDefaultsNum: number;
  namespace: PgNamespace;
  tags: { [tag: string]: string | Array<string> };
  aclExecutable: boolean;
}

export interface PgClass {
  kind: "class";
  id: string;
  name: string;
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
  tags: { [tag: string]: string | Array<string> };
  attributes: [PgAttribute];
  aclSelectable: boolean;
  aclInsertable: boolean;
  aclUpdatable: boolean;
  aclDeletable: boolean;
}

export interface PgType {
  kind: "type";
  id: string;
  name: string;
  description: string | void;
  namespaceId: string;
  namespaceName: string;
  type: string;
  category: string;
  domainIsNotNull: boolean;
  arrayItemTypeId: string | void;
  typeLength: number | void;
  isPgArray: boolean;
  classId: string | void;
  domainBaseTypeId: string | void;
  domainTypeModifier: number | void;
  tags: { [tag: string]: string | Array<string> };
}

export interface PgAttribute {
  kind: "attribute";
  classId: string;
  num: number;
  name: string;
  description: string | void;
  typeId: string;
  typeModifier: number;
  isNotNull: boolean;
  hasDefault: boolean;
  class: PgClass;
  type: PgType;
  namespace: PgNamespace;
  tags: { [tag: string]: string | Array<string> };
  aclSelectable: boolean;
  aclInsertable: boolean;
  aclUpdatable: boolean;
}

export interface PgConstraint {
  kind: "constraint";
  name: string;
  type: string;
  classId: string;
  foreignClassId: string | void;
  description: string | void;
  keyAttributeNums: Array<number>;
  foreignKeyAttributeNums: Array<number>;
  namespace: PgNamespace;
  tags: { [tag: string]: string | Array<string> };
}

export interface PgExtension {
  kind: "extension";
  id: string;
  name: string;
  namespaceId: string;
  relocatable: boolean;
  version: string;
  configurationClassIds?: Array<string>;
  description: string | void;
  tags: { [tag: string]: string | Array<string> };
}
