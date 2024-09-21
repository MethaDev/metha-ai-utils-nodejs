import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../middleware/async";
// import { ErrorResponse } from "../../middleware/error";
import fs from "fs";
import path from "path";
import utils from "util"
import hb from "handlebars";
import { config } from "dotenv";
import puppeteerCore from "puppeteer-core";
import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";
import nodemailer from "nodemailer";
import * as AWSClientSES from "@aws-sdk/client-ses";
import SESTransport from "nodemailer/lib/ses-transport";

config();

chromium.setHeadlessMode = true;
// chromium.setGraphicsMode = false;

// await chromium.font(
//   "https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf"
// );

console.log("SES_REGION = " + process.env.SES_REGION);
console.log("SES_ACCESS_KEY_ID = " + process.env.SES_ACCESS_KEY_ID);
console.log("SES_SECRET_ACCESS_KEY = " + process.env.SES_SECRET_ACCESS_KEY);

let ses: AWSClientSES.SES;
let transporter: nodemailer.Transporter<SESTransport.SentMessageInfo>;

async function initSES() {
  ses = new AWSClientSES.SES({
    apiVersion: "2012-10-17",
    region: process.env.SES_REGION || "us-east-1",
    credentials: {
      accessKeyId: process.env.SES_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.SES_SECRET_ACCESS_KEY || "",
    },
  });

  transporter = nodemailer.createTransport({
    SES: {
      ses,
      aws: AWSClientSES
    },
  });
}

export const reportPDFEMail = asyncHandler(
    async (req: any, res: Response, next: NextFunction) => {
      console.log("reportPDFEmail");
      try {
        const pdf = await generatePdf();
        console.log("reportPDFEmail after generate");
        const authorizerEmail: string = req.authorizer?.email;
        if (!authorizerEmail) {
          throw new Error("No authorization email");
        }
        if (!pdf) {
          throw new Error("PDF generate failed");
        }
        await sendMail(pdf, authorizerEmail);
        console.log("reportPDFEmail after send mail");
        res.sendStatus(200);
      } catch(ex) {
        console.log("reportPDFEmail Error: " + ex);
        res.sendStatus(400);
      }
    }
);

export const reportPDFDownload = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
      const pdf = await generatePdf();
      res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length });
      res.send(pdf);
  }
);

async function sendMail(file: any, sendTo: string) {
  await initSES();
  console.log("send mail ses sendTo " + sendTo);
  try {
    const mailOptions = {
      from: {
        name: "Elad Yefet",
        address: "elad.y@metha.ai"
      },
      to: sendTo,
      subject: "Your report is ready - Test",
      text: "Your report is ready",
      html: "<h1>Your report is ready</h1>",
      attachments: [{
          filename: "report",
          content: file,
          contentType: "application/pdf",
          ContentLength: file.length
      }],
    };

    const response = await transporter.sendMail(mailOptions);

  } catch (error) {
    console.error("SendMail: " + error);
  }
}

export const reportView = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("generateView");
    try {
      const html = await generateHTML();
      res.send(html);
    } catch (ex) {
      console.log("generateView Error: " + ex);
    }
  }
);

async function getTemplateHtml() {
    console.log("Loading template file in memory")
    try {
        const readFile = utils.promisify(fs.readFile);
        const templatePath = path.resolve("./src/views/templates/summary-pdf.hbs");
        return await readFile(templatePath, 'utf8');
    } catch (err) {
        return Promise.reject("Could not load html template");
    }
}

export async function generatePdf(): Promise<any> {
  console.log("generatePdf: begin");
  let result: any = null;
  let browser: any = null;
  try {
    console.log("generatePdf: before generateHTML");
    const htmlTemplate = await generateHTML();
    // We can use this to add dyamic data to our handlebas template at run time from database or API as per need. you can read the official doc to learn more https://handlebarsjs.com/
    // we are using headless mode
    console.log("generatePdf: before puppeteer.launch");
    browser = await puppeteerCore.launch({
      args: process.env.IS_LOCAL ? puppeteerCore.defaultArgs() : chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: process.env.IS_LOCAL ?
        await puppeteerCore.executablePath('chrome')
        : await chromium.executablePath(),
      headless: process.env.IS_LOCAL ? false : chromium.headless,
    });
    console.log("generatePdf: before browser newPage");
    const page = await browser.newPage();
    // We set the page content as the generated html by handlebars
    console.log("generatePdf: before setContent");
    await page.setContent(htmlTemplate, { waitUntil: ['load', 'domcontentloaded', 'networkidle0'] });
    await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
    // We use pdf function to generate the pdf in the same folder as this file.
    console.log("generatePdf: before page.pdf");
    result = await page.pdf({ format: 'A4' });
    await browser.close();
    console.log("PDF Generated");
  } catch (ex) {
    console.log("generatePdf Error: " + ex);
    throw new Error(JSON.stringify(ex));
  }
  return result;
}

export async function generateHTML(): Promise<any> {
  const data = {
    fullName: "bla bla",
    email: "blabla@gmail.com",
    chartData: {
      labels: ["Label 1", "Label 2", "Label 3"],
      data: [10, 20, 30],
    }
  };
  let html = await getTemplateHtml();
  // Now we have the html code of our template in res object
  // you can check by logging it on console
  console.log("Compiing the template with handlebars");
  const template = hb.compile(html, { strict: true });
  // we have compile our code with handlebars
  const result = template(data);
  return result;
}


// --------------------------------------------------------------------------------------
export const generateTemplateOld = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
      async function printPDF() {
          const browser = await puppeteer.launch({ headless: true });
          const page = await browser.newPage();
          // await page.goto('https://blog.risingstack.com', {waitUntil: 'networkidle0'});
          //   await page.goto('https://textologia.net/?p=16379', {waitUntil: 'networkidle0'});
          await page.goto('http://metha.ai', { waitUntil: 'networkidle0' });
          const pdf = await page.pdf({ format: 'A4' });

          await browser.close();
          return pdf
      }

      const pdf = await printPDF();
      res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length })
      res.send(pdf)
  }
);