import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { setSendTxLog, setHero, setMonster } from "../store/actions";
import {DevInspectResults, getMetadata, Obelisk, SuiMoveNormalizedModules, TransactionBlock, BCS, getSuiMoveConfig} from "@0xobelisk/client";
import {NETWORK, PACKAGE_ID, WORLD_ID} from "../chain/config";
import PRIVATEKEY from "../chain/key";

export default function PVPModal(props: any) {
  const catchResult = ["Catch monster successed!", "Monster got away.", "Catch miss"]
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

      await obelisk.tx.rpg_system.flee(tx, params, true)

      const response = await obelisk.signAndSendTxn(
        tx
      )
      console.log(response)
    // }
    if (response.effects.status.status === 'success') {
      alert("Run success")
    } else {
      alert("Fetch sui api failed.")
    }

    let player_data = await obelisk.getEntity(WORLD_ID, 'position', obelisk.getAddress())

    const encounter_contain = await obelisk.containEntity(WORLD_ID, "encounter", obelisk.getAddress())
    console.log(encounter_contain)
    console.log(JSON.stringify(player_data))
    const stepLength = 2.5;
    dispatch(setHero({
      name: obelisk.getAddress(),
      position: { left: player_data[0] * stepLength, top: player_data[1] * stepLength },
      lock: encounter_contain
    }))
    dispatch(setMonster({
      exist: encounter_contain
    }))
    if (encounter_contain === false) {
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
    let catch_result = -1
    if (response.effects.status.status === 'success') {
      response.events.map((event) => {
        if (event.parsedJson['_obelisk_schema_name'] === 'catch_result') {
          catch_result = event.parsedJson['data']['value']
        }
      })
    } else {
      alert("Fetch sui api failed.")
    }
      let player_data = await obelisk.getEntity(WORLD_ID, 'position', obelisk.getAddress())

    const encounter_contain = await obelisk.containEntity(WORLD_ID, "encounter", obelisk.getAddress())
    console.log(encounter_contain)
    console.log(JSON.stringify(player_data))
    const stepLength = 2.5;
    dispatch(setHero({
      name: obelisk.getAddress(),
      position: { left: player_data[0] * stepLength, top: player_data[1] * stepLength },
      lock: encounter_contain
    }))
    dispatch(setMonster({
      exist: encounter_contain
    }))
    if (encounter_contain === false) {
      dispatch(setSendTxLog({ ...sendTxLog, display: false }));
      console.log("catch successed")
    } else {
      console.log("catch failed")
    }
    alert(catchResult[catch_result])

  }

  return (
    <div className="pvp-modal" hidden={!sendTxLog.display}>
      {/* <div className="dialog-content" dangerouslySetInnerHTML={{ __html: sendTxLog.content }}></div> */}
      <div className="pvp-modal-content">
        Have monster
      <img src="assets/monster/gui.jpg"/>
      </div>

      <div className="pvp-modal-actions">
        <div className="pvp-modal-action-no" hidden={sendTxLog.noContent === '' || sendTxLog.noContent === undefined} onClick={() => handleNoTxLog()}>{sendTxLog.noContent}</div>
        <div className="pvp-modal-action-yes" hidden={sendTxLog.yesContent === '' || sendTxLog.yesContent === undefined} onClick={() => handleYesTxLog()}>{sendTxLog.yesContent}</div>
      </div>
    </div>
  );
}