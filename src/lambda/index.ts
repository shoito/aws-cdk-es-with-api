/* eslint-disable @typescript-eslint/camelcase */
import { createClient } from "./es";

const ELASTICSEARCH_ENDPOINT = process.env.ELASTICSEARCH_ENDPOINT || "";

export const handler = async () => {
  const health = await (await createClient(ELASTICSEARCH_ENDPOINT)).cat.health({
    format: "json"
  });

  return {
    statusCode: "200",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(health)
  };
};
