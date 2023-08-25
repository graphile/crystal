const fs = require("node:fs");
const os = require("node:os");
const { exec } = require("node:child_process");
const { isPropertyAccessOrQualifiedName } = require("typescript");

exec("yarn workspaces list -v --json", (err, stdout, stderr) => {
  if (err || stderr.length > 0) {
    // node couldn't execute the command
    console.log("Cannot get list of workspaces from yarn");
    process.exit(1);
  }
  const workspacesJSON = stdout.split(os.EOL);
  const workspaces = workspacesJSON
    .filter((json) => json.length > 0)
    .map((json) => JSON.parse(json))
    .filter((obj) => obj.location != ".");

  const locationToName = workspaces.reduce((mapping, next) => {
    mapping[next.location] = next.name;
    return mapping;
  }, Object.create(null));

  const packages = workspaces.map((workspace) => {
    const package = JSON.parse(
      fs.readFileSync(`${workspace.location}/package.json`, "utf8"),
    );
    return {
      name: workspace.name,
      location: workspace.location,
      hasTest: !!package.scripts.test && package.scripts.test.length > 0,
      hasPreTest:
        !!package.scripts.pretest && package.scripts.pretest.length > 0,
      hasPostTest:
        !!package.scripts.posttest && package.scripts.posttest.length > 0,
      dependencies: workspace.workspaceDependencies,
    };
  });

  const preTestPackages = packages
    .filter((package) => package.hasPreTest)
    .map((package) => package.name);

  const writeTestYaml = (package, command) => {
    const fileName = package.name.replace(/[^a-z0-9\-]/gi, "_").toLowerCase();
    const prePackPackages = [...new Set([...preTestPackages, package.name])];
    fs.writeFileSync(
      `.github/workflows/generated__${fileName}-${command}.yml`,
      `\
name: ${command} ${package.name}

on: [push]

jobs:
  runtest:
    name: Run ${command}
    uses: ./.github/workflows/test-base.yml
    with:
      prepackPackages: "{${prePackPackages.join(",")}}"
      package: "${package.name}"
      testcommand: "${command}"
${command == "test" ? '      args: "--ci"\n' : ""}`,
    );
  };

  packages
    .filter((package) => package.hasTest)
    .forEach((package) => writeTestYaml(package, "test"));

  packages
    .filter((package) => package.hasPostTest)
    .forEach((package) => writeTestYaml(package, "posttest"));
});
