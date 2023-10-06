import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { setSendTxLog, setHero, setMonster } from "../store/actions";
import {DevInspectResults, getMetadata, Obelisk, SuiMoveNormalizedModules, TransactionBlock, BCS, getSuiMoveConfig} from "@0xobelisk/client";
import {NETWORK, PACKAGE_ID, WORLD_ID} from "../chain/config";
import PRIVATEKEY from "../chain/key";

export default function PVPModal(props: any) {
  let dispatch = useDispatch();
  let sendTxLog = useSelector(state => state['sendTxLog']);
  const contractMetadata = useSelector(state => state["contractMetadata"])

  const handleNoTxLog = async () => {

    console.log(sendTxLog)
    // if (sendTxLog.onYes !== undefined) { 
      console.log("------- no")
      // sendTxLog.onYes();
      const obelisk = new Obelisk({
        networkType: NETWORK,
        packageId: PACKAGE_ID,
        metadata: contractMetadata,
        secretKey:PRIVATEKEY
      });

      let tx = new TransactionBlock()
      let params = [
        tx.pure(WORLD_ID)
      ]

      let txb = await obelisk.tx.rpg_system.flee(tx, params, true)
      console.log(txb)

      const response = await obelisk.signAndSendTxn(
        tx
      )
      console.log(response)
    // }

    let player_data = await obelisk.getEntity(WORLD_ID, 'position', obelisk.getAddress())

    let new_tx = new TransactionBlock()
    let new_params = [
      new_tx.pure(WORLD_ID),
      new_tx.pure(obelisk.getAddress())
    ]
    const encounter_contain = await obelisk.query.encounter_comp.contains(new_tx, new_params) as DevInspectResults;
    let returnValue = [];

    if (encounter_contain.effects.status.status === 'success') {
      let resultList = encounter_contain.results![0].returnValues!;
      for (let res of resultList) {
        const bcs = new BCS(getSuiMoveConfig());
        let value = Uint8Array.from(res[0]);
        let data = bcs.de(res[1], value);
        returnValue.push(data);
      }
    }
    // if (returnValue[0] === )
    console.log(returnValue[0])
    console.log(JSON.stringify(player_data))
    const stepLength = 2.5;
    dispatch(setHero({
      name: obelisk.getAddress(),
      position: { left: player_data[0] * stepLength, top: player_data[1] * stepLength },
      lock: returnValue[0]
    }))
    dispatch(setMonster({
      exist: returnValue[0]
    }))
    if (returnValue[0] === false) {
      dispatch(setSendTxLog({ ...sendTxLog, display: false }));
    }
    // if (sendTxLog.onNo !== undefined) {
    //   sendTxLog.onNo();
    // }
    // dispatch(setSendTxLog({ ...sendTxLog, display: false }));
  }

  // const handleYesTxLog = () => {
  //   if (sendTxLog.onYes !== undefined) { sendTxLog.onYes(); }
  //   dispatch(setSendTxLog({ ...sendTxLog, display: false }));
  // }

  const handleYesTxLog = async () => {
    console.log(sendTxLog)
    // if (sendTxLog.onYes !== undefined) { 
      console.log("------- 1")
      // sendTxLog.onYes();
      console.log(contractMetadata['contractMetadata'])
      const obelisk = new Obelisk({
        networkType: NETWORK,
        packageId: PACKAGE_ID,
        metadata: contractMetadata,
        secretKey:PRIVATEKEY
      });

      let tx = new TransactionBlock()
      let params = [
        tx.pure(WORLD_ID)
      ]

      let txb = await obelisk.tx.rpg_system.throw_ball(tx, params, true)
      console.log(txb)

      const response = await obelisk.signAndSendTxn(
        tx
      )
      console.log(response)
    // }

    let player_data = await obelisk.getEntity(WORLD_ID, 'position', obelisk.getAddress())

    let new_tx = new TransactionBlock()
    let new_params = [
      new_tx.pure(WORLD_ID),
      new_tx.pure(obelisk.getAddress())
    ]
    const encounter_contain = await obelisk.query.encounter_comp.contains(new_tx, new_params) as DevInspectResults;
    let returnValue = [];

    if (encounter_contain.effects.status.status === 'success') {
      let resultList = encounter_contain.results![0].returnValues!;
      for (let res of resultList) {
        const bcs = new BCS(getSuiMoveConfig());
        let value = Uint8Array.from(res[0]);
        let data = bcs.de(res[1], value);
        returnValue.push(data);
      }
    }
    // if (returnValue[0] === )
    console.log(returnValue[0])
    console.log(JSON.stringify(player_data))
    const stepLength = 2.5;
    dispatch(setHero({
      name: obelisk.getAddress(),
      position: { left: player_data[0] * stepLength, top: player_data[1] * stepLength },
      lock: returnValue[0]
    }))
    dispatch(setMonster({
      exist: returnValue[0]
    }))
    if (returnValue[0] === false) {
      dispatch(setSendTxLog({ ...sendTxLog, display: false }));
      console.log("catch successed")
    } else {
      console.log("catch failed")
    }
  }

  return (
    <div className="dialog" hidden={!sendTxLog.display}>
      <div className="dialog-content" dangerouslySetInnerHTML={{ __html: sendTxLog.content }}></div>
      <div className="dialog-actions">
        <div className="dialog-action-no" hidden={sendTxLog.noContent === '' || sendTxLog.noContent === undefined} onClick={() => handleNoTxLog()}>{sendTxLog.noContent}</div>
        <div className="dialog-action-yes" hidden={sendTxLog.yesContent === '' || sendTxLog.yesContent === undefined} onClick={() => handleYesTxLog()}>{sendTxLog.yesContent}</div>
      </div>
    </div>
  );
}