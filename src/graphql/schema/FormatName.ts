type FormatName = {
  readonly type: (fullName: string) => string,
  readonly field: (fullName: string) => string,
  readonly arg: (fullName: string) => string,
  readonly enumValue: (fullName: string) => string,
}

export default FormatName
