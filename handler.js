"use strict";

const AWS = require("aws-sdk");
const OktaJwtVerifier = require("@okta/jwt-verifier");
const csvToJson = require("csvtojson");
const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: "https://dev-674288.oktapreview.com/oauth2/default",
  clientId: "0oagr4td3sYTNYhcX0h7"
});
const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  region: "us-east-1"
});

module.exports.getdata = async (event, context) => {
  const { Authorization } = event.headers;
  let response = "{}";

  try {
    // Authorise.
    const jwt = await oktaJwtVerifier.verifyAccessToken(Authorization);

    // Get CSV data.
    const csvResponse = await s3
      .getObject({
        Bucket: "marmite-toast-private",
        Key: "2018-vs-2019.csv"
      })
      .promise();
    const csvData = csvResponse.Body.toString("utf-8");

    // Convert CSV into JSON.
    const jsonData = await csvToJson().fromString(csvData);

    // Setup response.
    response = {
      statusCode: 200,
      body: JSON.stringify(jsonData)
    };
  } catch (error) {
    console.error(error);
    response = {
      statusCode: 400,
      body: JSON.stringify(error)
    };
  }

  return response;
};
