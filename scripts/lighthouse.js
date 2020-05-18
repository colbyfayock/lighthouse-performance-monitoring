#!/usr/bin/env node

const { exec } = require('child_process');

(async function() {

  const timestamp = Date.now();
  const command = buildLighthouseCommand({
    url: process.env.AUDIT_URL,
    chromeFlags: '--headless',
    outputType: 'json',
    outputPath: `./reports/lighthouse-${timestamp}.json`
  });

  try {
    await promiseToExec(command);
  } catch(e) {
    console.log(`Failed to execute lighthouse: ${e.message}`);
    throw e;
  }

})();

/**
 * buildLighthouseCommand
 */

function buildLighthouseCommand({ url, chromeFlags, outputType, outputPath }) {
  const args = [];

  if ( chromeFlags ) {
    args.push(`--chrome-flags="${chromeFlags}"`);
  }

  if ( url ) {
    args.push(url);
  }

  if ( outputType ) {
    args.push(`--output="${outputType}"`);
  }

  if ( outputType ) {
    args.push(`--output-path="${outputPath}"`);
  }

  return `lighthouse ${args.join(' ')}`;
}

/**
 * promiseToExec
 */

function promiseToExec(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout, stderr);
    });
  })
}