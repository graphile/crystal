#!/usr/bin/env node
import { runCli } from "graphile-config/cli";

import { options, run } from "./cli.ts";

function noop() {}

runCli(options, run).then(null, noop);
