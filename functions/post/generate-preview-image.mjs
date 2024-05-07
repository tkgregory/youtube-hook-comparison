'use strict';

import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({});

export const handler = async (event) => {
  let browser = null;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath('/opt/nodejs/node_modules/@sparticuz/chromium/bin'),
      headless: chromium.headless,
    });

    let page = await browser.newPage();
    await page.goto('https://example.com');

    const screenshot = await page.screenshot();
    const s3putObjectCommand = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: "test.png",
      Body: screenshot,
    });

    const response = await s3Client.send(s3putObjectCommand);
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };

  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};