export const PARTITION_EXPOSE_OPTIONS = ["both", "child", "parent"] as const;
export type PartitionExpose = (typeof PARTITION_EXPOSE_OPTIONS)[number];
