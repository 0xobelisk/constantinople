import {DevInspectResults, getMetadata, Obelisk, TransactionBlock} from "@0xobelisk/client";
import {useEffect, useState} from "react";
import {useAtom} from "jotai";
import { Map, Dialog } from "../../components";
import {Value} from "../../jotai";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from 'react-redux';
import {NETWORK, PACKAGE_ID, WORLD_ID} from "../../chain/config";
import {obeliskConfig} from "../../../obelisk.config";
import PRIVATEKEY from "../../chain/key";
import { setHero, setMapData } from "../../store/actions"

type data = {
    type:string;
    fields:Record<string, any>;
    hasPublicTransfer:boolean;
    dataType:"moveObject";
}

const Home = () =>{
  let dispatch = useDispatch();
    const router = useRouter()
    const [value,setValue] = useAtom(Value)
    const [isLoading, setIsLoading] = useState(false)

    const rpgworld = async () => {
        const metadata = await getMetadata(NETWORK, PACKAGE_ID);
        const obelisk = new Obelisk({
            networkType: NETWORK,
            packageId: PACKAGE_ID,
            metadata: metadata,
            secretKey:PRIVATEKEY
        });


        const player_id = "0xa9288f6ebe5ea276cd64230458d0c6c80725ca4c0dfc42a6d4af08a96832c52c"
        const player_data = await obelisk.getEntity(WORLD_ID, 'position', player_id)
        console.log(player_data)
        console.log(JSON.stringify(player_data))
        const stepLength = 2.5;
        console.log( player_data[0] * stepLength)
        dispatch(setHero({
          name: player_id,
          position: { left: player_data[0] * stepLength, top: player_data[1] * stepLength },
        }))
    

        const map_data = await obelisk.getEntity(WORLD_ID, 'map')

        dispatch(setMapData({map: map_data[0], type: "green",
        ele_description: {
          walkable: [0],
          tussock: [20],
          flower: [22],
          
          object: [40, 41],
          sprite: [42, 43],
          old_man: [43],
          fat_man: [44],
    
          ground_top_1: [50],
          ground_top_2: [51],
          ground_top_3: [52],
          ground_middle_1: [53],
          ground_middle_2: [54],
          ground_middle_3: [55],
          ground_bottom_1: [56],
          ground_bottom_2: [57],
          ground_bottom_3: [58],
    
          water_top_1: [60],
          water_top_2: [61],
          water_top_3: [62],
          water_middle_1: [63],
          water_middle_2: [64],
          water_middle_3: [65],
          water_bottom_1: [66],
          water_bottom_2: [67],
          water_bottom_3: [68],
          
          obelisk_top: [70],
          obelisk_middle_1: [71],
          obelisk_middle_2: [72],
          obelisk_bottom: [73],
          obelisk_bottom_left: [74],
          obelisk_bottom_right: [75],
    
          tree_top: [80],
          tree_bottom: [81],
          unwalkable: [83],
          rocks: [84],
    
          big_house_1: [100],
          big_house_2: [101],
          big_house_3: [102],
          big_house_4: [103],
          big_house_5: [104],
          big_house_6: [105],
          big_house_7: [106],
          big_house_8: [107],
          big_house_9: [108],
          big_house_10: [109],
          big_house_11: [110],
          big_house_12: [111],
          big_house_13: [112],
          big_house_14: [113],
          big_house_15: [114],
          big_house_16: [115],
          big_house_17: [116],
          big_house_18: [117],
          big_house_19: [118],
          big_house_20: [119],
          big_house_21: [120],
          big_house_22: [121],
          big_house_23: [122],
          big_house_24: [123],
          big_house_25: [124],
          big_house_26: [125],
          big_house_27: [126],
          big_house_28: [127],
          big_house_29: [128],
          big_house_30: [129],
          big_house_31: [130],
          big_house_32: [131],
          big_house_33: [132],
          big_house_34: [133],
          big_house_35: [134],
    
    
          small_house_1: [135],
          small_house_2: [136],
          small_house_3: [137],
          small_house_4: [138],
          small_house_5: [139],
          small_house_6: [140],
          small_house_7: [141],
          small_house_8: [142],
          small_house_9: [143],
          small_house_10: [144],
          small_house_11: [145],
          small_house_12: [146],
          small_house_13: [147],
          small_house_14: [148],
          small_house_15: [149],
          small_house_16: [150],
          small_house_17: [151],
          small_house_18: [152],
          small_house_19: [153],
          small_house_20: [154],
          small_house_21: [155],
          small_house_22: [156],
          small_house_23: [157],
          small_house_24: [158],
          small_house_25: [159],
    
          house_land: [160],
          house_stree: [161],
        },
        events: [],
        map_type: "event",}))

        // const new_tx = await obelisk.tx.map_comp.get(tx, params,true) as TransactionBlock;
        // const response = await obelisk.signAndSendTxn(
        //     new_tx
        // )

        // if (response.effects.status.status == 'success') {
        //     const metadata = await getMetadata(NETWORK, PACKAGE_ID);
        //     const obelisk = new Obelisk({
        //         networkType: NETWORK,
        //         packageId: PACKAGE_ID,
        //         metadata: metadata,
        //     });
        //     const component_name = Object.keys(obeliskConfig.singletonComponents)[0]
        //     const component_value = await obelisk.getComponentByName(WORLD_ID,component_name)
        //     const content = component_value.data.content as data
        //     const value = content.fields.value.fields.data
        //     setValue(value)
        // }
        setIsLoading(true)
    }

    useEffect(() => {
        if (router.isReady){
          rpgworld()
        }
    }, [router.isReady]);


    // useEffect(() => {
    //     if (router.isReady){
    //         const query_counter = async () => {
    //             const metadata = await getMetadata(NETWORK, PACKAGE_ID);
    //             const obelisk = new Obelisk({
    //                 networkType: NETWORK,
    //                 packageId: PACKAGE_ID,
    //                 metadata: metadata,
    //             });
    //             // counter component name
    //             const component_name = Object.keys(obeliskConfig.singletonComponents)[0]
    //             const component_value = await obelisk.getComponentByName(WORLD_ID,component_name)
    //             console.log(component_value)
    //             const content = component_value.data.content as data
    //             console.log(content)
    //             const value = content.fields.value.fields.data
    //             console.log(value)
    //             setValue(value)
    //         }
    //         query_counter()
    //     }
    // }, [router.isReady]);
    if (isLoading) {

      return (
        <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <div style={{minHeight: '1px', display: 'flex', marginBottom: '20px', position: 'relative'}}>
          <Map />
          {/* <!-- Inputs --> */}
          <div style={{ width: 'calc(20vw - 1rem)', maxHeight: '100vh', marginLeft: '10px'}}>
            {/* { page === 1 && 
              <>
                <GenMap />
                <ViewMap />
                <Alert />
              </>
            } */}
            {/* { page === 2 && */}
              <>
              </>
            {/* } */}
          </div>
        </div>
      <Dialog />
      </div>
        // <div>
        //     <div>
        //         Counter: {value}
        //     </div>
        //     <div>
        //         <button onClick={()=>{
        //             counter()
        //         }}>Counter++</button>
        //     </div>
        // </div>
    )
    } else {
      <></>
    }
}

export default Home


