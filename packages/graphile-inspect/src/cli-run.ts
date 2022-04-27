#!/usr/bin/env node
import { runCli } from "graphile-plugin/cli";

import { options, run } from "./cli.js";

runCli(options, run);
