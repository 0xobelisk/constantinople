import { Obelisk, TransactionBlock } from '@0xobelisk/client';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { SendTxLog, Hero, ContractMetadata, Monster, OwnedMonster } from '../state';
import { NETWORK, PACKAGE_ID, WORLD_ID } from '../chain/config';
import { PRIVATEKEY } from '../chain/key';

export default function PVPModal(props: any) {
  const catchResult = ['Catch monster successed!', 'Monster got away.', 'Catch miss'];

  const [sendTxLog, setSendTxLog] = useAtom(SendTxLog);
  const contractMetadata = useAtomValue(ContractMetadata);
  const setMonster = useSetAtom(Monster);
  const [ownedMonster, setOwnedMonster] = useAtom(OwnedMonster);
  const setHero = useSetAtom(Hero);

  const handleNoTxLog = async () => {
    // if (sendTxLog.onYes !== undefined) {
    // sendTxLog.onYes();
    const obelisk = new Obelisk({
      networkType: NETWORK,
      packageId: PACKAGE_ID,
      metadata: contractMetadata,
      secretKey: PRIVATEKEY,
    });

    let tx = new TransactionBlock();
    let params = [tx.pure(WORLD_ID)];

    await obelisk.tx.rpg_system.flee(tx, params, true);

    const response = await obelisk.signAndSendTxn(tx);
    console.log(response);
    // }
    if (response.effects.status.status === 'success') {
      alert('Run success');
    } else {
      alert('Fetch sui api failed.');
    }

    let player_data = await obelisk.getEntity(WORLD_ID, 'position', obelisk.getAddress());

    const encounter_contain = await obelisk.containEntity(WORLD_ID, 'encounter', obelisk.getAddress());
    console.log(encounter_contain);
    console.log(JSON.stringify(player_data));
    const stepLength = 2.5;
    setHero({
      name: obelisk.getAddress(),
      position: { left: player_data[0] * stepLength, top: player_data[1] * stepLength },
      lock: encounter_contain,
    });
    setMonster({
      exist: encounter_contain,
    });
    if (encounter_contain === false) {
      setSendTxLog({ ...sendTxLog, display: false });
    }
    // if (sendTxLog.onNo !== undefined) {
    //   sendTxLog.onNo();
    // }
    // dispatch(setSendTxLog({ ...sendTxLog, display: false }));
  };

  // const handleYesTxLog = () => {
  //   if (sendTxLog.onYes !== undefined) { sendTxLog.onYes(); }
  //   dispatch(setSendTxLog({ ...sendTxLog, display: false }));
  // }

  const handleYesTxLog = async () => {
    console.log(sendTxLog);
    // if (sendTxLog.onYes !== undefined) {
    console.log('------- 1');
    // sendTxLog.onYes();
    const obelisk = new Obelisk({
      networkType: NETWORK,
      packageId: PACKAGE_ID,
      metadata: contractMetadata,
      secretKey: PRIVATEKEY,
    });

    let tx = new TransactionBlock();
    let params = [tx.pure(WORLD_ID)];

    let txb = await obelisk.tx.rpg_system.throw_ball(tx, params, true);
    console.log(txb);

    const response = await obelisk.signAndSendTxn(tx);
    console.log(response);
    let catch_result = -1;
    if (response.effects.status.status === 'success') {
      response.events.map(event => {
        let obelisk_schema_id = event.parsedJson['_obelisk_schema_id'];
        console.log(obelisk_schema_id);
        const textDecoder = new TextDecoder('utf-8');
        const obelisk_schema_name = textDecoder.decode(new Uint8Array(obelisk_schema_id));

        if (obelisk_schema_name === 'catch_result') {
          catch_result = event.parsedJson['data']['value'];
        }
      });
    } else {
      alert('Fetch sui api failed.');
    }
    let player_data = await obelisk.getEntity(WORLD_ID, 'position', obelisk.getAddress());

    const encounter_contain = await obelisk.containEntity(WORLD_ID, 'encounter', obelisk.getAddress());
    console.log(encounter_contain);
    console.log(JSON.stringify(player_data));
    const stepLength = 2.5;
    setHero({
      name: obelisk.getAddress(),
      position: { left: player_data[0] * stepLength, top: player_data[1] * stepLength },
      lock: encounter_contain,
    });
    setMonster({
      exist: encounter_contain,
    });
    if (encounter_contain === false) {
      setSendTxLog({ ...sendTxLog, display: false });
      console.log('catch successed');
    } else {
      console.log('catch failed');
    }
    console.log(`here  ------ ${catch_result}`);
    alert(catchResult[catch_result]);
  };

  return (
    <div className="pvp-modal" hidden={!sendTxLog.display}>
      {/* <div className="dialog-content" dangerouslySetInnerHTML={{ __html: sendTxLog.content }}></div> */}
      <div className="pvp-modal-content">
        Have monster
        <img src="assets/monster/gui.jpg" />
      </div>

      <div className="pvp-modal-actions">
        <div
          className="pvp-modal-action-no"
          hidden={sendTxLog.noContent === '' || sendTxLog.noContent === undefined}
          onClick={() => handleNoTxLog()}
        >
          {sendTxLog.noContent}
        </div>
        <div
          className="pvp-modal-action-yes"
          hidden={sendTxLog.yesContent === '' || sendTxLog.yesContent === undefined}
          onClick={() => handleYesTxLog()}
        >
          {sendTxLog.yesContent}
        </div>
      </div>
    </div>
  );
}
