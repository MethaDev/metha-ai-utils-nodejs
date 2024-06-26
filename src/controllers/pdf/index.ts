import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../middleware/async";
// import { ErrorResponse } from "../../middleware/error";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import utils from "util"
import hb from "handlebars";


export const generateTemplate = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const pdf = await generatePdf();
        res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length });
        res.send(pdf)
    }
);

export const generateView = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
      const html = await generateHTML();
      res.send(html);
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
    const htmlTemplate = await generateHTML();
    // We can use this to add dyamic data to our handlebas template at run time from database or API as per need. you can read the official doc to learn more https://handlebarsjs.com/
    // we are using headless mode
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // We set the page content as the generated html by handlebars
    await page.setContent(htmlTemplate, {waitUntil: 'networkidle0'});
    // We use pdf function to generate the pdf in the same folder as this file.
    const generatedPdf = await page.pdf({ format: 'A4' });
    await browser.close();
    console.log("PDF Generated");
    return generatedPdf;
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
  // console.log(res)
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