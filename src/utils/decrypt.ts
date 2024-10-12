import { KMSClient, DecryptCommand, DecryptCommandInput } from "@aws-sdk/client-kms";

export async function decryptEnvVar(name: string) {
    try {
        const client = new KMSClient({region: 'us-east-1'});
        const encrypted: string = process.env[name] || "";
        const req: DecryptCommandInput = {
          CiphertextBlob: Buffer.from(encrypted, 'base64'),
          EncryptionContext: { LambdaFunctionName: process.env.AWS_LAMBDA_FUNCTION_NAME || ""},
        };
        const command = new DecryptCommand(req);
        const response = await client.send(command);
        const decrypted = new TextDecoder().decode(response.Plaintext);
   
        process.env[name] = decrypted;
        return decrypted;
      } catch (err) {
        console.log('Decrypt error:', err);
        throw err;
      }
   }
