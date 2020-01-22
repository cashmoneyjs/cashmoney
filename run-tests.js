#!/usr/bin/env node
"use strict";

const path = require("path");

process.env.TS_NODE_PROJECT = path.join(__dirname, "tests", "tsconfig.json");

Object.defineProperty(exports, "__esModule", { value: true });
require("ts-node/register");
require("tsconfig-paths/register");

require("./tests/bootstrap.ts");

const alsatian_cli_options_1 = require("alsatian/dist/cli/alsatian-cli-options");
const cli_test_runner_1 = require("alsatian/dist/cli/cli-test-runner");
const userArguments = new alsatian_cli_options_1.AlsatianCliOptions(process.argv.slice(2));
const cliTestRunner = cli_test_runner_1.CliTestRunner.create();
cliTestRunner.run(userArguments);
