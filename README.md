# OMG-front

- how to execute

```bash
npm i -g typescript
git clone https://github.com/KMU-WINK/OMG-back.git
cd OMG-back
npm i

# USE TS-NODE
npm i -g ts-node
NCLOUD_SECRET=... ts-node src/server.ts

# USE NODE
tsc
NCLOUD_SECRET=... node build/server.js

# USE PM2
npm i -g pm2
tsc
NCLOUD_SECRET=... pm2 start build/server.js

# port: 8080
```
