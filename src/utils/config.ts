import process from "process";

export default {
  DB: {
    host: "127.0.0.1",
    port: 3306,
    username: "wink",
    password: "1234",
    database: "omg",
  },
  AUTH: {
    secretKey: "Jr&3f7*7e!0JU3Hx",
    hashKey: "&B%N8Q7h#3!w1oZs",
  },
  NCLOUD: {
    from: "01049556397",
    serviceId: "ncp:sms:kr:260833842477:omg",
    accessKey: "TrhItKOt6CG1aOVRbgg6",
    secretKey: process.env["NCLOUD_SECRET"] ?? "",
  },
  PRICE: {
    SOJU: 1,
    BEER: 100,
    EXTRA: 10000,
  },
  POINT: {
    SOJU: 1,
    BEER: 100,
    EXTRA: 10000,
  },
};
