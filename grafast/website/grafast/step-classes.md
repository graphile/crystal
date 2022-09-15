```ts
class AddStep extends ExecutableStep {
  constructor($a, $b) {
    super();
    this.addDependency($a);
    this.addDependency($b);
  }
  execute([aList, bList]) {
    return aList.map((a, i) => {
      return a + bList[i];
    );
  }
}
```

:::note

By convention, when a variable represents a step we start the variables name
with a `$`.

:::
