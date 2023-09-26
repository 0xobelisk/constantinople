const { Ed25519Keypair,fromB64 } = require("@mysten/sui.js");
const fs = require('fs');

const keypair = new Ed25519Keypair()

const privateKey_u8 = fromB64(keypair.export().privateKey)
const privateKey = Buffer.from(privateKey_u8).toString('hex');

const path = process.cwd()
const chainFolderPath = `${path}/src/chain`;
fs.mkdirSync(chainFolderPath, { recursive: true });

fs.writeFileSync(`${path}/.env`, `PRIVATE_KEY=${privateKey}`);

fs.writeFileSync(`${path}/src/chain/key.ts`, `
const PRIVATEKEY = '${privateKey}'
export default PRIVATEKEY
`);
