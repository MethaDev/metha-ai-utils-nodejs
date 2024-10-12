import * as AWSClientSES from "@aws-sdk/client-ses";
import nodemailer from "nodemailer";
import SESTransport from "nodemailer/lib/ses-transport";
import { decryptEnvVar } from "./decrypt"

console.log("SES_REGION = " + process.env.SES_REGION);
console.log("SES_ACCESS_KEY_ID = " + process.env.SES_ACCESS_KEY_ID);
console.log("SES_SECRET_ACCESS_KEY = " + process.env.SES_SECRET_ACCESS_KEY);

export async function emailService(): Promise<nodemailer.Transporter<SESTransport.SentMessageInfo>> {
    const accessKeyId: string = process.env.IS_LOCAL ? (process.env.SES_ACCESS_KEY_ID || "") : await decryptEnvVar("SES_ACCESS_KEY_ID");
    const secretAccessKey: string = process.env.IS_LOCAL ? (process.env.SES_SECRET_ACCESS_KEY || "") : await decryptEnvVar("SES_SECRET_ACCESS_KEY");
      
    console.log("sesREGION = " + process.env.SES_REGION || "us-east-1");
    console.log("accessKeyId = " + accessKeyId);
    console.log("secretAccessKey = " + secretAccessKey);
  
    const ses: AWSClientSES.SES = new AWSClientSES.SES({
      apiVersion: "2012-10-17",
      region: process.env.SES_REGION || "us-east-1",
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });
  
    const transporter: nodemailer.Transporter<SESTransport.SentMessageInfo> = nodemailer.createTransport({
      SES: {
        ses,
        aws: AWSClientSES
      },
    });

    return transporter;
  }
  