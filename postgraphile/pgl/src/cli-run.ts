#!/usr/bin/env node
import { runCli } from "graphile-config/cli";
import { options, run } from "postgraphile/cli";

runCli(options, run);
