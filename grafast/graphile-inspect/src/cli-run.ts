#!/usr/bin/env node
import { runCli } from "graphile-config/cli";

import { options, run } from "./cli.js";

runCli(options, run);
