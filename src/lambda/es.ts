import {
  createAWSConnection,
  awsCredsifyAll,
  awsGetCredentials
} from "@acuris/aws-es-connection";
import { Client } from "@elastic/elasticsearch";

export const createClient = async (node: string): Promise<Client> => {
  const awsCredentials = await awsGetCredentials();
  const AWSConnection = createAWSConnection(awsCredentials);
  return awsCredsifyAll(
    new Client({
      node: `https://${node}`,
      Connection: AWSConnection
    })
  );
};
