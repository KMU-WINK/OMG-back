import crypto from "crypto";
import fetch from "node-fetch";
import config from "./config";

const sign = (
  method: string,
  path: string,
  timestamp: string,
  accessKey: string,
  secretKey: string
) => {
  return crypto
    .createHmac("sha256", secretKey)
    .update(`${method} ${path}\n${timestamp}\n${accessKey}`)
    .digest("base64");
};

const sendSms = async (to: string, content: string) => {
  let path = `/sms/v2/services/${config.NCLOUD.serviceId}/messages`;
  let method = "POST";
  let timestamp = (+new Date()).toString();

  let resp = await fetch(`https://sens.apigw.ntruss.com${path}`, {
    method,
    headers: {
      "Content-type": "application/json; charset=utf-8",
      "x-ncp-apigw-timestamp": timestamp,
      "x-ncp-iam-access-key": config.NCLOUD.accessKey,
      "x-ncp-apigw-signature-v2": sign(
        method,
        path,
        timestamp,
        config.NCLOUD.accessKey,
        config.NCLOUD.secretKey
      ),
    },
    body: JSON.stringify({
      type: "SMS",
      from: config.NCLOUD.from,
      content: content,
      messages: [{ to }],
    }),
  });
  let json = await resp.json();

  return json.statusName === "success";
};

export { sendSms };
