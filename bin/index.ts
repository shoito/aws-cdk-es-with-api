#!/usr/bin/env node
import "source-map-support/register";
import cdk = require("@aws-cdk/core");
import { ApiStack } from "../lib/api";
import { ElasticsearchStack } from "../lib/elasticsearch";
import { bundleNpm } from "../lib/setup";

bundleNpm();

const app = new cdk.App();
const esStack = new ElasticsearchStack(app, "elasticsearch-stack");
const apiStack = new ApiStack(app, "api-stack");

if (!process.env.LOCAL_DEV) {
  apiStack.addDependency(esStack);
}
