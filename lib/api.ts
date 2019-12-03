import cdk = require("@aws-cdk/core");
import lambda = require("@aws-cdk/aws-lambda");
import apigateway = require("@aws-cdk/aws-apigateway");
import { NODE_LAMBDA_LAYER_DIR } from "./setup";

export class ApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const layer = new lambda.LayerVersion(this, "layer", {
      code: lambda.Code.fromAsset(NODE_LAMBDA_LAYER_DIR, {
        exclude: ["**/*.ts"]
      }),
      compatibleRuntimes: [lambda.Runtime.NODEJS_10_X],
      layerVersionName: "layer"
    });

    const catLambda = new lambda.Function(this, "cat", {
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: "handlers/index.handler",
      layers: [layer],
      code: lambda.Code.fromAsset("src/lambda", { exclude: ["**/*.ts"] }),
      functionName: "cat",
      environment: {
        ELASTICSEARCH_ENDPOINT: cdk.Fn.importValue("elasticsearch-endpoint")
      }
    });

    const restApi = new apigateway.RestApi(this, "restApi", {
      restApiName: "es-apig",
      deployOptions: {
        stageName: "dev"
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS
      }
    });

    const catResource = restApi.root.addResource("cat");
    const catIntegration = new apigateway.LambdaIntegration(catLambda);
    catResource.addMethod("GET", catIntegration, {});
  }
}
