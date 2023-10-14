import {
  DevInspectResults,
  getMetadata,
  Obelisk,
  TransactionBlock,
  BCS,
  SuiTransactionBlockResponse,
} from '@0xobelisk/client';
import { NETWORK, PACKAGE_ID, WORLD_ID } from '../src/chain/config';
import { PRIVATEKEY } from '../src/chain/key';

async function main() {
  const metadata = await getMetadata(NETWORK, PACKAGE_ID);

  const obelisk = new Obelisk({
    networkType: NETWORK,
    packageId: PACKAGE_ID,
    metadata: metadata,
    secretKey: PRIVATEKEY,
  });

  let tx = new TransactionBlock();
  let params = [tx.pure(WORLD_ID)];

  const result = (await obelisk.tx.rpg_system.init_map(tx, params)) as SuiTransactionBlockResponse;
  console.log(result.effects.status.status);
}

main();
