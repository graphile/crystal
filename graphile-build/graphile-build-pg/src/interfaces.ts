export const PARTITION_PARENT_MODES = ["both", "child", "parent"] as const;
export type PartitionParentMode = (typeof PARTITION_PARENT_MODES)[number];
