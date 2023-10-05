import {DevInspectResults, getMetadata, Obelisk, SuiMoveNormalizedModules, TransactionBlock} from "@0xobelisk/client";
import { useEffect, useState, useRef, useMemo, ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setDialog } from "../store/actions";
import axios from 'axios';
import { marked } from 'marked';
import {NETWORK, PACKAGE_ID, WORLD_ID} from "../chain/config";
import PRIVATEKEY from "../chain/key";

export default function Map() {
  let dispatch = useDispatch();
  const treasureCount = 2;
  const spriteCount = 5;

let playerSprites = { "W": 
  'assets/player/W.gif',
 "S": 
  'assets/player/S.gif',
 "A": 
  'assets/player/A.gif',
 "D": 
  'assets/player/D.gif' }
function loadImage(imageUrl){
  return new Promise(resolve => {
      const image = new Image()
      image.src = imageUrl
      image.onload = function () {
      resolve(image);
      }
  });
}


  async function loadSprites(imagesUrl: any){
      return (await Promise.all(imagesUrl.map(loadImage)))
  }
  
  const [heroImg, setHeroImg] = useState(playerSprites["S"])

  let [rowNumber, setRowNumber] = useState(1);
  let [unboxState, setUnboxState] = useState({});
  let mapData = useSelector(state => state["mapData"]);
  let mapSeed = useSelector(state => state["mapSeed"]);
  let hero = useSelector(state => state["hero"]);
  
  const [stepTransactions, setStepTransactions] = useState<string[]>([]);
  // let [stepTxB, setStepTxB] = useState<TransactionBlock>(new TransactionBlock());
  let stepTxB1 = new TransactionBlock()
  // fill screen with rows of block
  const calcOriginalMapRowNumber = function (height: any, width: any) {
    // subtract the p tag height
    height = height * 0.75;
    // one block is 2.5vw high
    let blockHeight = width * 0.025;
    return height / blockHeight;
  };

  // paint original placeholder map before generating
  const drawOriginalMap = function () {
    const { innerWidth: width, innerHeight: height } = window;
    let row = calcOriginalMapRowNumber(height, width);
    row = parseInt(row.toString()) + 1;
    setRowNumber(row);
  };

  const withinRange = (value: number, arr: number[]) => {
    if (arr.length === 1) {
      return value === arr[0];
    } else if (arr.length > 1) {
      return value >= arr[0] && value <= arr[1];
    }
  };

  const initialRandomState = () => {
    
    if (mapData.map.length === 0) {
      return {}
    }
    let randomState = {}
    // console.log(mapData.map[0]);
    for (let i = 0; i < mapData.map.length; i++) {
      for (let j = 0; j < 32; j++) {
        let key = `${i}-${j}`;
        randomState[key] = Math.floor(Math.random() * spriteCount + 1)
        if (mapData.ele_description.object !== undefined && withinRange(mapData.map[i][j], mapData.ele_description.object)){
          randomState[key] = Math.floor(Math.random() * treasureCount + 1)
        } else if (withinRange(mapData.map[i][j], mapData.ele_description.sprite)) {
          randomState[key] = Math.floor(Math.random() * spriteCount + 1)
        }
      }
    }
    // setRandomState(randomState);
    return randomState;
  }

  const initialEvents = () => {
    if (mapData.events.length === 0) {
      return {}
    }
    let eventsDict = {}
    for (let i = 0; i < mapData.events.length; i++) {
      let event = mapData.events[i];
      let key = `${event.y}-${event.x}`;
      eventsDict[key] = event;
    }
    return eventsDict;
  }

  let randomState1 = useMemo(() => initialRandomState(), [mapData]);
  let eventsState = useMemo(() => initialEvents(), [mapData]);
  const setBlockType = (map: any[][], x: number, y: number, ele_description: any, blockType: any, key: any) => {
    let img: ReactElement;
    let className = '';
    const title = eventsState[`${x}-${y}`] !== undefined ? 
      <div style={{position: 'absolute', top: `${2.5 * x - 1.25}vw`, left: `${2.5 * y+1.25}vw`, color: 'red'}}>!</div> : '';
    if (withinRange(map[x][y], ele_description.walkable)) {
      className = 'walkable';
    } else if (withinRange(map[x][y], ele_description.unwalkable)) {
      className = 'unwalkable small-tree-img';
    } else if (withinRange(map[x][y], ele_description.flower)) {
      className = 'walkable flower-img';
      // img = <img src={require('../assets/img/block/flower.gif')} alt='unwalkable' />;
    } else if (withinRange(map[x][y], ele_description.tree_top)) {
      className = 'unwalkable tree-top-img';
    } else if (withinRange(map[x][y], ele_description.tree_bottom)) {
      className = 'unwalkable tree-bottom-img';
    } else if (withinRange(map[x][y], ele_description.tussock)) {
      className = 'walkable tussock';
    } else if (withinRange(map[x][y], ele_description.ground_top_1)) {
      className = 'walkable ground-img-1';
    } else if (withinRange(map[x][y], ele_description.ground_top_2)) {
      className = 'walkable ground-img-2';
    } else if (withinRange(map[x][y], ele_description.ground_top_3)) {
      className = 'walkable ground-img-3';
    } else if (withinRange(map[x][y], ele_description.ground_middle_1)) {
      className = 'walkable ground-img-4';
    } else if (withinRange(map[x][y], ele_description.ground_middle_2)) {
      className = 'walkable ground-img-5';
    } else if (withinRange(map[x][y], ele_description.ground_middle_3)) {
      className = 'walkable ground-img-6';
    } else if (withinRange(map[x][y], ele_description.ground_bottom_1)) {
      className = 'walkable ground-img-7';
    } else if (withinRange(map[x][y], ele_description.ground_bottom_2)) {
      className = 'walkable ground-img-8';
    } else if (withinRange(map[x][y], ele_description.ground_bottom_3)) {
      className = 'walkable ground-img-9';
    } else if (withinRange(map[x][y], ele_description.water_top_1)) {
      className = 'walkable water-img-1';
    } else if (withinRange(map[x][y], ele_description.water_top_2)) {
      className = 'unwalkable water-img-2';
    } else if (withinRange(map[x][y], ele_description.water_top_3)) {
      className = 'unwalkable water-img-3';
    } else if (withinRange(map[x][y], ele_description.water_middle_1)) {
      className = 'unwalkable water-img-4';
    } else if (withinRange(map[x][y], ele_description.water_middle_2)) {
      className = 'unwalkable water-img-5';
    } else if (withinRange(map[x][y], ele_description.water_middle_3)) {
      className = 'unwalkable water-img-6';
    } else if (withinRange(map[x][y], ele_description.water_bottom_1)) {
      className = 'unwalkable water-img-7';
    } else if (withinRange(map[x][y], ele_description.water_bottom_2)) {
      className = 'unwalkable water-img-8';
    } else if (withinRange(map[x][y], ele_description.water_bottom_3)) {
      className = 'unwalkable water-img-9';
    } else if (withinRange(map[x][y], ele_description.big_house_1)) {
      className = 'unwalkable big-house-img-1';
    } else if (withinRange(map[x][y], ele_description.big_house_2)) {
      className = 'unwalkable big-house-img-2';
    } else if (withinRange(map[x][y], ele_description.big_house_3)) {
      className = 'unwalkable big-house-img-3';
    } else if (withinRange(map[x][y], ele_description.big_house_4)) {
      className = 'unwalkable big-house-img-4';
    } else if (withinRange(map[x][y], ele_description.big_house_5)) {
      className = 'unwalkable big-house-img-5';
    } else if (withinRange(map[x][y], ele_description.big_house_6)) {
      className = 'unwalkable big-house-img-6';
    } else if (withinRange(map[x][y], ele_description.big_house_7)) {
      className = 'unwalkable big-house-img-7';
    } else if (withinRange(map[x][y], ele_description.big_house_8)) {
      className = 'unwalkable big-house-img-8';
    } else if (withinRange(map[x][y], ele_description.big_house_9)) {
      className = 'unwalkable big-house-img-9';
    } else if (withinRange(map[x][y], ele_description.big_house_10)) {
      className = 'unwalkable big-house-img-10';
    } else if (withinRange(map[x][y], ele_description.big_house_11)) {
      className = 'unwalkable big-house-img-11';
    } else if (withinRange(map[x][y], ele_description.big_house_12)) {
      className = 'unwalkable big-house-img-12';
    } else if (withinRange(map[x][y], ele_description.big_house_13)) {
      className = 'unwalkable big-house-img-13';
    } else if (withinRange(map[x][y], ele_description.big_house_14)) {
      className = 'unwalkable big-house-img-14';
    } else if (withinRange(map[x][y], ele_description.big_house_15)) {
      className = 'unwalkable big-house-img-15';
    } else if (withinRange(map[x][y], ele_description.big_house_16)) {
      className = 'unwalkable big-house-img-16';
    } else if (withinRange(map[x][y], ele_description.big_house_17)) {
      className = 'unwalkable big-house-img-17';
    } else if (withinRange(map[x][y], ele_description.big_house_18)) {
      className = 'unwalkable big-house-img-18';
    } else if (withinRange(map[x][y], ele_description.big_house_19)) {
      className = 'unwalkable big-house-img-19';
    } else if (withinRange(map[x][y], ele_description.big_house_20)) {
      className = 'unwalkable big-house-img-20';
    } else if (withinRange(map[x][y], ele_description.big_house_21)) {
      className = 'unwalkable big-house-img-21';
    } else if (withinRange(map[x][y], ele_description.big_house_22)) {
      className = 'unwalkable big-house-img-22';
    } else if (withinRange(map[x][y], ele_description.big_house_23)) {
      className = 'unwalkable big-house-img-23';
    } else if (withinRange(map[x][y], ele_description.big_house_24)) {
      className = 'unwalkable big-house-img-24';
    } else if (withinRange(map[x][y], ele_description.big_house_25)) {
      className = 'unwalkable big-house-img-25';
    } else if (withinRange(map[x][y], ele_description.big_house_26)) {
      className = 'unwalkable big-house-img-26';
    } else if (withinRange(map[x][y], ele_description.big_house_27)) {
      className = 'unwalkable big-house-img-27';
    } else if (withinRange(map[x][y], ele_description.big_house_28)) {
      className = 'unwalkable big-house-img-28';
    } else if (withinRange(map[x][y], ele_description.big_house_29)) {
      className = 'unwalkable big-house-img-29';
    } else if (withinRange(map[x][y], ele_description.big_house_30)) {
      className = 'unwalkable big-house-img-30';
    } else if (withinRange(map[x][y], ele_description.big_house_31)) {
      className = 'unwalkable big-house-img-31';
    } else if (withinRange(map[x][y], ele_description.big_house_32)) {
      className = 'unwalkable big-house-img-32';
    } else if (withinRange(map[x][y], ele_description.big_house_33)) {
      // const sprite = 'sprite' + randomState1[`${x}-${y}`];
      className = `unwalkable big-house-img-33`;
    } else if (withinRange(map[x][y], ele_description.big_house_34)) {
      className = 'unwalkable big-house-img-34';
    } else if (withinRange(map[x][y], ele_description.big_house_35)) {
      className = 'unwalkable big-house-img-35';
    } else if (withinRange(map[x][y], ele_description.small_house_1)) {
      className = 'unwalkable small-house-img-1';
    } else if (withinRange(map[x][y], ele_description.small_house_2)) {
      className = 'unwalkable small-house-img-2';
    } else if (withinRange(map[x][y], ele_description.small_house_3)) {
      className = 'unwalkable small-house-img-3';
    } else if (withinRange(map[x][y], ele_description.small_house_4)) {
      className = 'unwalkable small-house-img-4';
    } else if (withinRange(map[x][y], ele_description.small_house_5)) {
      className = 'unwalkable small-house-img-5';
    } else if (withinRange(map[x][y], ele_description.small_house_6)) {
      className = 'unwalkable small-house-img-6';
    } else if (withinRange(map[x][y], ele_description.small_house_7)) {
      className = 'unwalkable small-house-img-7';
    } else if (withinRange(map[x][y], ele_description.small_house_8)) {
      className = 'unwalkable small-house-img-8';
    } else if (withinRange(map[x][y], ele_description.small_house_9)) {
      className = 'unwalkable small-house-img-9';
    } else if (withinRange(map[x][y], ele_description.small_house_10)) {
      className = 'unwalkable small-house-img-10';
    } else if (withinRange(map[x][y], ele_description.small_house_11)) {
      className = 'unwalkable small-house-img-11';
    } else if (withinRange(map[x][y], ele_description.small_house_12)) {
      className = 'unwalkable small-house-img-12';
    } else if (withinRange(map[x][y], ele_description.small_house_13)) {
      className = 'unwalkable small-house-img-13';
    } else if (withinRange(map[x][y], ele_description.small_house_14)) {
      className = 'unwalkable small-house-img-14';
    } else if (withinRange(map[x][y], ele_description.small_house_15)) {
      className = 'unwalkable small-house-img-15';
    } else if (withinRange(map[x][y], ele_description.small_house_16)) {
      className = 'unwalkable small-house-img-16';
    } else if (withinRange(map[x][y], ele_description.small_house_17)) {
      className = 'unwalkable small-house-img-17';
    } else if (withinRange(map[x][y], ele_description.small_house_18)) {
      className = 'unwalkable small-house-img-18';
    } else if (withinRange(map[x][y], ele_description.small_house_19)) {
      className = 'unwalkable small-house-img-19';
    } else if (withinRange(map[x][y], ele_description.small_house_20)) {
      className = 'unwalkable small-house-img-20';
    } else if (withinRange(map[x][y], ele_description.small_house_21)) {
      className = 'unwalkable small-house-img-21';
    } else if (withinRange(map[x][y], ele_description.small_house_22)) {
      className = 'unwalkable small-house-img-22';
    } else if (withinRange(map[x][y], ele_description.small_house_23)) {
      className = 'unwalkable small-house-img-23';
    } else if (withinRange(map[x][y], ele_description.small_house_24)) {
      className = `unwalkable small-house-img-24`;
    } else if (withinRange(map[x][y], ele_description.small_house_25)) {
      className = 'unwalkable small-house-img-25';
    } else if (withinRange(map[x][y], ele_description.house_land)) {
      className = 'walkable land-img';
    } else if (withinRange(map[x][y], ele_description.house_stree)) {
      className = 'unwalkable street-img';
    } else if (withinRange(map[x][y], ele_description.obelisk_top)) {
      className = 'unwalkable obelisk-img-1';
    } else if (withinRange(map[x][y], ele_description.obelisk_middle_1)) {
      className = 'unwalkable obelisk-img-2';
    } else if (withinRange(map[x][y], ele_description.obelisk_middle_2)) {
      className = 'unwalkable obelisk-img-3';
    } else if (withinRange(map[x][y], ele_description.obelisk_bottom)) {
      className = `unwalkable obelisk-img-4`;
    } else if (withinRange(map[x][y], ele_description.obelisk_bottom_left)) {
      className = 'unwalkable obelisk-img-5';
    } else if (withinRange(map[x][y], ele_description.obelisk_bottom_right)) {
      className = 'unwalkable obelisk-img-6';
    } else if (withinRange(map[x][y], ele_description.old_man)) {
      className = `unwalkable oldman-img npc_man`;
    } else if (withinRange(map[x][y], ele_description.fat_man)) {
      // const sprite = 'sprite' + randomState1[`${x}-${y}`];
      className = `unwalkable fatman-img`;
      // const npc_image = mapData.map_type == 'gallery' ? 'gallery_house' : sprite;
      // img = <img src={require(`../assets/img/block/fatman.png`)} alt={npc_image} onClick={() => onInteract(x, y)}/>
    } else if (withinRange(map[x][y], ele_description.rocks)) {
      className = 'unwalkable rocks-img';
    } else if (ele_description.object !== undefined && withinRange(map[x][y], ele_description.object)) {
      let lockState = unboxState[`${x}-${y}`] === true ? 'unlocked' : 'locked';
      let randomStateKey = randomState1[`${x}-${y}`];
      const object = `treasure-${lockState}-${randomStateKey}`;
      className = `unwalkable ${object}`;
      img = <img src={require(`../assets/img/block/${object}.png`)} alt={object} onClick={() => onInteract(x, y)} style={{cursor: ifInRange(x, y) ? 'pointer' : ''}}/>
    } else if (withinRange(map[x][y], ele_description.sprite)) {
      const sprite = 'sprite' + randomState1[`${x}-${y}`];
      className = `unwalkable ${sprite}`;
      const ncp_image = mapData.map_type == 'gallery' ? 'gallery_house' : sprite;
      img = <img src={require(`../assets/img/block/${ncp_image}.png`)} alt={ncp_image} onClick={() => onInteract(x, y)} style={{cursor: ifInRange(x, y) ? 'pointer' : ''}}/>
    }
    return <div className={`map-block flex ${className} ${blockType}`} key={key}>{title}{img}</div>
  };

  const drawBlock = (map, i, j, type, ele_description, key) => {
    let blockType = '';
    if (['ice', 'sand', 'green'].includes(type)) {
      blockType = type;
    }
    return setBlockType(map, i, j, ele_description, blockType, key);
  }

  useEffect(() => {
    drawOriginalMap();
  });

  // -------------------- Game Logic --------------------
  const stepLength = 2.5;
  let direction = null;
  let targetPosition = null;
  const mapContainerRef = useRef(null);
  const heroRef = useRef(null);
  const [heroPosition, setHeroPosition] = useState({left: hero['position']['left'], top: hero['position']['top']});
  // const [heroPosition, setHeroPosition] = useState({left: 5, top: 5});

  // move moving-block when possible
  const move = async (direction: string, stepLength: number) => {
    if (willCrossBorder(direction, stepLength)) {
      console.log('will cross border');
      return;
    }
    const currentPosition = getCoordinate(stepLength);
    if (willCollide(currentPosition, direction)) {
      console.log("collide");
      return;
    }
    // const metadata = {"entity_key":{"fileFormatVersion":6,"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"entity_key","friends":[],"structs":{},"exposedFunctions":{"from_bytes":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Vector":"U8"}],"return":["Address"]},"from_object":{"visibility":"Public","isEntry":false,"typeParameters":[{"abilities":["Store","Key"]}],"parameters":[{"Reference":{"TypeParameter":0}}],"return":["Address"]},"from_position":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":["U64","U64"],"return":["Address"]},"from_u256":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":["U256"],"return":["Address"]}}},"init":{"fileFormatVersion":6,"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"init","friends":[],"structs":{},"exposedFunctions":{}},"map_comp":{"fileFormatVersion":6,"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"map_comp","friends":[{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"move_system"}],"structs":{"CompMetadata":{"abilities":{"abilities":["Store"]},"typeParameters":[],"fields":[{"name":"id","type":"Address"},{"name":"name","type":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}},{"name":"types","type":{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}},{"name":"entity_key_to_index","type":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address","U64"]}}},{"name":"entities","type":{"Struct":{"address":"0x2","module":"table_vec","name":"TableVec","typeArguments":["Address"]}}},{"name":"data","type":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address",{"Vector":"U8"}]}}}]}},"exposedFunctions":{"data":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":[{"Reference":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address",{"Vector":"U8"}]}}}]},"decode":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Vector":"U8"}],"return":[{"Vector":{"Vector":"U8"}}]},"encode":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Vector":{"Vector":"U8"}}],"return":[{"Vector":"U8"}]},"entities":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":[{"Reference":{"Struct":{"address":"0x2","module":"table_vec","name":"TableVec","typeArguments":["Address"]}}}]},"entity_length":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":["U64"]},"get":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":[{"Vector":{"Vector":"U8"}}]},"id":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":["Address"]},"name":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":[{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}]},"new":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"map_comp","name":"CompMetadata","typeArguments":[]}}]},"register":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[]},"types":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":[{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}]},"update":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"Vector":{"Vector":"U8"}}],"return":[]}}},"movable_comp":{"fileFormatVersion":6,"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"movable_comp","friends":[{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"move_system"}],"structs":{"CompMetadata":{"abilities":{"abilities":["Store"]},"typeParameters":[],"fields":[{"name":"id","type":"Address"},{"name":"name","type":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}},{"name":"types","type":{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}},{"name":"entity_key_to_index","type":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address","U64"]}}},{"name":"entities","type":{"Struct":{"address":"0x2","module":"table_vec","name":"TableVec","typeArguments":["Address"]}}},{"name":"data","type":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address",{"Vector":"U8"}]}}}]}},"exposedFunctions":{"add":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address","Bool"],"return":[]},"contains":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":["Bool"]},"data":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":[{"Reference":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address",{"Vector":"U8"}]}}}]},"decode":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Vector":"U8"}],"return":["Bool"]},"encode":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":["Bool"],"return":[{"Vector":"U8"}]},"entities":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":[{"Reference":{"Struct":{"address":"0x2","module":"table_vec","name":"TableVec","typeArguments":["Address"]}}}]},"entity_length":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":["U64"]},"get":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":["Bool"]},"id":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":["Address"]},"name":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":[{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}]},"new":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"movable_comp","name":"CompMetadata","typeArguments":[]}}]},"register":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[]},"remove":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":[]},"types":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":[{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}]},"update":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address","Bool"],"return":[]}}},"move_system":{"fileFormatVersion":6,"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"move_system","friends":[],"structs":{},"exposedFunctions":{"down":{"visibility":"Public","isEntry":true,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[]},"left":{"visibility":"Public","isEntry":true,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[]},"register":{"visibility":"Public","isEntry":true,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[]},"right":{"visibility":"Public","isEntry":true,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[]},"up":{"visibility":"Public","isEntry":true,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[]}}},"player_comp":{"fileFormatVersion":6,"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"player_comp","friends":[{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"move_system"}],"structs":{"CompMetadata":{"abilities":{"abilities":["Store"]},"typeParameters":[],"fields":[{"name":"id","type":"Address"},{"name":"name","type":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}},{"name":"types","type":{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}},{"name":"entity_key_to_index","type":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address","U64"]}}},{"name":"entities","type":{"Struct":{"address":"0x2","module":"table_vec","name":"TableVec","typeArguments":["Address"]}}},{"name":"data","type":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address",{"Vector":"U8"}]}}}]}},"exposedFunctions":{"add":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address","Bool"],"return":[]},"contains":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":["Bool"]},"data":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":[{"Reference":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address",{"Vector":"U8"}]}}}]},"decode":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Vector":"U8"}],"return":["Bool"]},"encode":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":["Bool"],"return":[{"Vector":"U8"}]},"entities":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":[{"Reference":{"Struct":{"address":"0x2","module":"table_vec","name":"TableVec","typeArguments":["Address"]}}}]},"entity_length":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":["U64"]},"get":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":["Bool"]},"id":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":["Address"]},"name":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":[{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}]},"new":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"player_comp","name":"CompMetadata","typeArguments":[]}}]},"register":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[]},"remove":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":[]},"types":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":[{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}]},"update":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address","Bool"],"return":[]}}},"position_comp":{"fileFormatVersion":6,"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"position_comp","friends":[{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"move_system"}],"structs":{"CompMetadata":{"abilities":{"abilities":["Store"]},"typeParameters":[],"fields":[{"name":"id","type":"Address"},{"name":"name","type":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}},{"name":"types","type":{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}},{"name":"entity_key_to_index","type":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address","U64"]}}},{"name":"entities","type":{"Struct":{"address":"0x2","module":"table_vec","name":"TableVec","typeArguments":["Address"]}}},{"name":"data","type":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address",{"Vector":"U8"}]}}}]}},"exposedFunctions":{"add":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address","U64","U64"],"return":[]},"contains":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":["Bool"]},"data":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":[{"Reference":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address",{"Vector":"U8"}]}}}]},"decode":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Vector":"U8"}],"return":["U64","U64"]},"encode":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":["U64","U64"],"return":[{"Vector":"U8"}]},"entities":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":[{"Reference":{"Struct":{"address":"0x2","module":"table_vec","name":"TableVec","typeArguments":["Address"]}}}]},"entity_length":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":["U64"]},"get":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":["U64","U64"]},"get_x":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":["U64"]},"get_y":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":["U64"]},"id":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":["Address"]},"name":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":[{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}]},"new":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"position_comp","name":"CompMetadata","typeArguments":[]}}]},"register":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[]},"remove":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":[]},"types":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":[{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}]},"update":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address","U64","U64"],"return":[]},"update_x":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address","U64"],"return":[]},"update_y":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address","U64"],"return":[]}}},"world":{"fileFormatVersion":6,"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"world","friends":[],"structs":{"AdminCap":{"abilities":{"abilities":["Key"]},"typeParameters":[],"fields":[{"name":"id","type":{"Struct":{"address":"0x2","module":"object","name":"UID","typeArguments":[]}}}]},"CompAddField":{"abilities":{"abilities":["Copy","Drop"]},"typeParameters":[],"fields":[{"name":"comp","type":"Address"},{"name":"key","type":"Address"},{"name":"data","type":{"Vector":"U8"}}]},"CompRegister":{"abilities":{"abilities":["Copy","Drop"]},"typeParameters":[],"fields":[{"name":"comp","type":"Address"},{"name":"compname","type":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}},{"name":"types","type":{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}}]},"CompRemoveField":{"abilities":{"abilities":["Copy","Drop"]},"typeParameters":[],"fields":[{"name":"comp","type":"Address"},{"name":"key","type":"Address"}]},"CompUpdateField":{"abilities":{"abilities":["Copy","Drop"]},"typeParameters":[],"fields":[{"name":"comp","type":"Address"},{"name":"key","type":{"Struct":{"address":"0x1","module":"option","name":"Option","typeArguments":["Address"]}}},{"name":"data","type":{"Vector":"U8"}}]},"World":{"abilities":{"abilities":["Store","Key"]},"typeParameters":[],"fields":[{"name":"id","type":{"Struct":{"address":"0x2","module":"object","name":"UID","typeArguments":[]}}},{"name":"name","type":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}},{"name":"description","type":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}},{"name":"comps","type":{"Struct":{"address":"0x2","module":"bag","name":"Bag","typeArguments":[]}}},{"name":"compnames","type":{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}},{"name":"admin","type":{"Struct":{"address":"0x2","module":"object","name":"ID","typeArguments":[]}}},{"name":"version","type":"U64"}]}},"exposedFunctions":{"add_comp":{"visibility":"Public","isEntry":false,"typeParameters":[{"abilities":["Store"]}],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"Vector":"U8"},{"TypeParameter":0}],"return":[]},"compnames":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":[{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}]},"contains":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":["Bool"]},"create":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}},{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}},{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}]},"emit_add_event":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":["Address","Address",{"Vector":"U8"}],"return":[]},"emit_register_event":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Vector":"U8"},{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}],"return":[]},"emit_remove_event":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":["Address","Address"],"return":[]},"emit_update_event":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":["Address",{"Struct":{"address":"0x1","module":"option","name":"Option","typeArguments":["Address"]}},{"Vector":"U8"}],"return":[]},"get_comp":{"visibility":"Public","isEntry":false,"typeParameters":[{"abilities":["Store"]}],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":[{"Reference":{"TypeParameter":0}}]},"get_mut_comp":{"visibility":"Public","isEntry":false,"typeParameters":[{"abilities":["Store"]}],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":[{"MutableReference":{"TypeParameter":0}}]},"info":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":[{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}},{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}},"U64"]},"migrate":{"visibility":"Private","isEntry":true,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"AdminCap","typeArguments":[]}}}],"return":[]}}}} as SuiMoveNormalizedModules
    // const obelisk = new Obelisk({
    //     networkType: NETWORK,
    //     packageId: PACKAGE_ID,
    //     metadata: metadata,
    //     secretKey:PRIVATEKEY
    // });
    let left: number, top: number;
    // console.log(stepTxB)
    // console.log(stepTxB.blockData.transactions)

    let stepTransactionsItem = stepTransactions
    switch (direction) {
      case 'left':
        left = heroPosition.left - stepLength;
        setHeroPosition({...heroPosition, left: left});
        stepTransactionsItem.push(direction)

        // let params_left = [
        //   stepTxB.pure(WORLD_ID)
        // ]
        // obelisk.tx.move_system.left(stepTxB, params_left, true) as TransactionBlock
        break;
      case 'top':
        top = heroPosition.top - stepLength;
        setHeroPosition({...heroPosition, top: top});
        scrollIfNeeded('top');
        stepTransactionsItem.push(direction)

        // let params_top = [
        //   stepTxB.pure(WORLD_ID)
        // ]
        // obelisk.tx.move_system.down(stepTxB, params_top, true) as TransactionBlock

        break;
      case 'right':
        left = heroPosition.left + stepLength;
        setHeroPosition({...heroPosition, left: left});
        stepTransactionsItem.push(direction)

        // let params_right = [
        //   stepTxB.pure(WORLD_ID)
        // ]

        // obelisk.tx.move_system.right(stepTxB, params_right, true) as TransactionBlock
        break;
      case 'bottom':
        top = heroPosition.top + stepLength;
        setHeroPosition({...heroPosition, top: top});
        scrollIfNeeded('bottom');
        stepTransactionsItem.push(direction)
        // let params_down = [
        //   stepTxB.pure(WORLD_ID)
        // ]

        // obelisk.tx.move_system.up(stepTxB, params_down, true) as TransactionBlock
        break;
      default:
        break;
    }

    // let stepTransactionsItem = stepTransactions
    // stepTransactionsItem.push(direction)
    // setStepTransactions(stepTransactionsItem)
    // console.log(stepTransactionsItem)
    // if (stepTransactionsItem.length === 10) {
      
    //   const response = await obelisk.signAndSendTxn(
    //       stepTxB
    //   )
    //   console.log(response)
      
    //   setStepTransactions([])
    //   stepTxB = new TransactionBlock()
    // }


    setStepTransactions(stepTransactionsItem)
    console.log(stepTransactionsItem)
    if (stepTransactionsItem.length === 10) {
      setStepTransactions([])

      const metadata = {"entity_key":{"fileFormatVersion":6,"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"entity_key","friends":[],"structs":{},"exposedFunctions":{"from_bytes":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Vector":"U8"}],"return":["Address"]},"from_object":{"visibility":"Public","isEntry":false,"typeParameters":[{"abilities":["Store","Key"]}],"parameters":[{"Reference":{"TypeParameter":0}}],"return":["Address"]},"from_position":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":["U64","U64"],"return":["Address"]},"from_u256":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":["U256"],"return":["Address"]}}},"init":{"fileFormatVersion":6,"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"init","friends":[],"structs":{},"exposedFunctions":{}},"map_comp":{"fileFormatVersion":6,"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"map_comp","friends":[{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"move_system"}],"structs":{"CompMetadata":{"abilities":{"abilities":["Store"]},"typeParameters":[],"fields":[{"name":"id","type":"Address"},{"name":"name","type":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}},{"name":"types","type":{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}},{"name":"entity_key_to_index","type":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address","U64"]}}},{"name":"entities","type":{"Struct":{"address":"0x2","module":"table_vec","name":"TableVec","typeArguments":["Address"]}}},{"name":"data","type":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address",{"Vector":"U8"}]}}}]}},"exposedFunctions":{"data":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":[{"Reference":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address",{"Vector":"U8"}]}}}]},"decode":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Vector":"U8"}],"return":[{"Vector":{"Vector":"U8"}}]},"encode":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Vector":{"Vector":"U8"}}],"return":[{"Vector":"U8"}]},"entities":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":[{"Reference":{"Struct":{"address":"0x2","module":"table_vec","name":"TableVec","typeArguments":["Address"]}}}]},"entity_length":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":["U64"]},"get":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":[{"Vector":{"Vector":"U8"}}]},"id":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":["Address"]},"name":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":[{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}]},"new":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"map_comp","name":"CompMetadata","typeArguments":[]}}]},"register":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[]},"types":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":[{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}]},"update":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"Vector":{"Vector":"U8"}}],"return":[]}}},"movable_comp":{"fileFormatVersion":6,"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"movable_comp","friends":[{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"move_system"}],"structs":{"CompMetadata":{"abilities":{"abilities":["Store"]},"typeParameters":[],"fields":[{"name":"id","type":"Address"},{"name":"name","type":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}},{"name":"types","type":{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}},{"name":"entity_key_to_index","type":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address","U64"]}}},{"name":"entities","type":{"Struct":{"address":"0x2","module":"table_vec","name":"TableVec","typeArguments":["Address"]}}},{"name":"data","type":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address",{"Vector":"U8"}]}}}]}},"exposedFunctions":{"add":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address","Bool"],"return":[]},"contains":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":["Bool"]},"data":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":[{"Reference":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address",{"Vector":"U8"}]}}}]},"decode":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Vector":"U8"}],"return":["Bool"]},"encode":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":["Bool"],"return":[{"Vector":"U8"}]},"entities":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":[{"Reference":{"Struct":{"address":"0x2","module":"table_vec","name":"TableVec","typeArguments":["Address"]}}}]},"entity_length":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":["U64"]},"get":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":["Bool"]},"id":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":["Address"]},"name":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":[{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}]},"new":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"movable_comp","name":"CompMetadata","typeArguments":[]}}]},"register":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[]},"remove":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":[]},"types":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":[{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}]},"update":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address","Bool"],"return":[]}}},"move_system":{"fileFormatVersion":6,"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"move_system","friends":[],"structs":{},"exposedFunctions":{"down":{"visibility":"Public","isEntry":true,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[]},"left":{"visibility":"Public","isEntry":true,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[]},"register":{"visibility":"Public","isEntry":true,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[]},"right":{"visibility":"Public","isEntry":true,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[]},"up":{"visibility":"Public","isEntry":true,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[]}}},"player_comp":{"fileFormatVersion":6,"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"player_comp","friends":[{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"move_system"}],"structs":{"CompMetadata":{"abilities":{"abilities":["Store"]},"typeParameters":[],"fields":[{"name":"id","type":"Address"},{"name":"name","type":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}},{"name":"types","type":{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}},{"name":"entity_key_to_index","type":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address","U64"]}}},{"name":"entities","type":{"Struct":{"address":"0x2","module":"table_vec","name":"TableVec","typeArguments":["Address"]}}},{"name":"data","type":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address",{"Vector":"U8"}]}}}]}},"exposedFunctions":{"add":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address","Bool"],"return":[]},"contains":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":["Bool"]},"data":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":[{"Reference":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address",{"Vector":"U8"}]}}}]},"decode":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Vector":"U8"}],"return":["Bool"]},"encode":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":["Bool"],"return":[{"Vector":"U8"}]},"entities":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":[{"Reference":{"Struct":{"address":"0x2","module":"table_vec","name":"TableVec","typeArguments":["Address"]}}}]},"entity_length":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":["U64"]},"get":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":["Bool"]},"id":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":["Address"]},"name":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":[{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}]},"new":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"player_comp","name":"CompMetadata","typeArguments":[]}}]},"register":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[]},"remove":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":[]},"types":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":[{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}]},"update":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address","Bool"],"return":[]}}},"position_comp":{"fileFormatVersion":6,"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"position_comp","friends":[{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"move_system"}],"structs":{"CompMetadata":{"abilities":{"abilities":["Store"]},"typeParameters":[],"fields":[{"name":"id","type":"Address"},{"name":"name","type":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}},{"name":"types","type":{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}},{"name":"entity_key_to_index","type":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address","U64"]}}},{"name":"entities","type":{"Struct":{"address":"0x2","module":"table_vec","name":"TableVec","typeArguments":["Address"]}}},{"name":"data","type":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address",{"Vector":"U8"}]}}}]}},"exposedFunctions":{"add":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address","U64","U64"],"return":[]},"contains":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":["Bool"]},"data":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":[{"Reference":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address",{"Vector":"U8"}]}}}]},"decode":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Vector":"U8"}],"return":["U64","U64"]},"encode":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":["U64","U64"],"return":[{"Vector":"U8"}]},"entities":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":[{"Reference":{"Struct":{"address":"0x2","module":"table_vec","name":"TableVec","typeArguments":["Address"]}}}]},"entity_length":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":["U64"]},"get":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":["U64","U64"]},"get_x":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":["U64"]},"get_y":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":["U64"]},"id":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":["Address"]},"name":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":[{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}]},"new":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"position_comp","name":"CompMetadata","typeArguments":[]}}]},"register":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[]},"remove":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":[]},"types":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":[{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}]},"update":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address","U64","U64"],"return":[]},"update_x":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address","U64"],"return":[]},"update_y":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address","U64"],"return":[]}}},"world":{"fileFormatVersion":6,"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"world","friends":[],"structs":{"AdminCap":{"abilities":{"abilities":["Key"]},"typeParameters":[],"fields":[{"name":"id","type":{"Struct":{"address":"0x2","module":"object","name":"UID","typeArguments":[]}}}]},"CompAddField":{"abilities":{"abilities":["Copy","Drop"]},"typeParameters":[],"fields":[{"name":"comp","type":"Address"},{"name":"key","type":"Address"},{"name":"data","type":{"Vector":"U8"}}]},"CompRegister":{"abilities":{"abilities":["Copy","Drop"]},"typeParameters":[],"fields":[{"name":"comp","type":"Address"},{"name":"compname","type":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}},{"name":"types","type":{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}}]},"CompRemoveField":{"abilities":{"abilities":["Copy","Drop"]},"typeParameters":[],"fields":[{"name":"comp","type":"Address"},{"name":"key","type":"Address"}]},"CompUpdateField":{"abilities":{"abilities":["Copy","Drop"]},"typeParameters":[],"fields":[{"name":"comp","type":"Address"},{"name":"key","type":{"Struct":{"address":"0x1","module":"option","name":"Option","typeArguments":["Address"]}}},{"name":"data","type":{"Vector":"U8"}}]},"World":{"abilities":{"abilities":["Store","Key"]},"typeParameters":[],"fields":[{"name":"id","type":{"Struct":{"address":"0x2","module":"object","name":"UID","typeArguments":[]}}},{"name":"name","type":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}},{"name":"description","type":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}},{"name":"comps","type":{"Struct":{"address":"0x2","module":"bag","name":"Bag","typeArguments":[]}}},{"name":"compnames","type":{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}},{"name":"admin","type":{"Struct":{"address":"0x2","module":"object","name":"ID","typeArguments":[]}}},{"name":"version","type":"U64"}]}},"exposedFunctions":{"add_comp":{"visibility":"Public","isEntry":false,"typeParameters":[{"abilities":["Store"]}],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"Vector":"U8"},{"TypeParameter":0}],"return":[]},"compnames":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":[{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}]},"contains":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":["Bool"]},"create":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}},{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}},{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}]},"emit_add_event":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":["Address","Address",{"Vector":"U8"}],"return":[]},"emit_register_event":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Vector":"U8"},{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}],"return":[]},"emit_remove_event":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":["Address","Address"],"return":[]},"emit_update_event":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":["Address",{"Struct":{"address":"0x1","module":"option","name":"Option","typeArguments":["Address"]}},{"Vector":"U8"}],"return":[]},"get_comp":{"visibility":"Public","isEntry":false,"typeParameters":[{"abilities":["Store"]}],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":[{"Reference":{"TypeParameter":0}}]},"get_mut_comp":{"visibility":"Public","isEntry":false,"typeParameters":[{"abilities":["Store"]}],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":[{"MutableReference":{"TypeParameter":0}}]},"info":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":[{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}},{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}},"U64"]},"migrate":{"visibility":"Private","isEntry":true,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"AdminCap","typeArguments":[]}}}],"return":[]}}}} as SuiMoveNormalizedModules
      const obelisk = new Obelisk({
          networkType: NETWORK,
          packageId: PACKAGE_ID,
          metadata: metadata,
          secretKey:PRIVATEKEY
      });
      const stepTxB = new TransactionBlock()

      let params = [
        stepTxB.pure(WORLD_ID)
      ]
      for (let historyDirection of stepTransactionsItem) {
        switch (historyDirection) {
          case 'left':
            console.log('---- left')
            // let params_left = [
            //   stepTxB.pure(WORLD_ID)
            // ]
            obelisk.tx.move_system.left(stepTxB, params, true) as TransactionBlock
            break;
          case 'top':
            console.log('---- top')

            // let params_top = [
            //   stepTxB.pure(WORLD_ID)
            // ]
            obelisk.tx.move_system.down(stepTxB, params, true) as TransactionBlock
            break;
          case 'right':
            console.log('---- right')

            // let params_right = [
            //   stepTxB.pure(WORLD_ID)
            // ]
    
            obelisk.tx.move_system.right(stepTxB, params, true) as TransactionBlock
            break;
          case 'bottom':
            console.log('---- bottom')

            // let params_down = [
            //   stepTxB.pure(WORLD_ID)
            // ]
    
            obelisk.tx.move_system.up(stepTxB, params, true) as TransactionBlock
            break;
          default:
            break;
        }
    
      }
      
      const response = await obelisk.signAndSendTxn(
          stepTxB
      )
      console.log(response)
    }
  };

  // check if moving-block will be out of map
  const willCrossBorder = (direction: any, stepLength: number) => {
    if (direction === 'left') {
      return heroPosition.left - stepLength < 0;
    } else if (direction === 'right') {
      // FIXME
      // return heroPosition.left + oDiv.clientWidth + stepLength > map.clientWidth;
      return heroPosition.left + 2 * stepLength > stepLength * 32;
    } else if (direction === 'top') {
      return heroPosition.top - stepLength < 0;
    } else if (direction === 'bottom') {
      return heroPosition.top + 2 * stepLength > stepLength * mapData.map.length;
    }
  };

  const scrollSmoothly = (scrollLength: any, scrollStep: any) => {
    const scrollInterval = setInterval(() => {
      mapContainerRef.current.scrollBy(0, scrollStep);
      scrollLength -= scrollStep;
      if (scrollLength === 0) {
        clearInterval(scrollInterval);
      }
    });
  };

  // scroll map when part of moving-block is out of wrapper
  const scrollIfNeeded = (direction: any) => {
    const scrollLength = parseInt((mapContainerRef.current.clientHeight / 3).toString());
    if (
      direction === 'bottom' &&
      heroRef.current.getBoundingClientRect().bottom >
      mapContainerRef.current.getBoundingClientRect().bottom
    ) {
      
      scrollSmoothly(scrollLength, 1);
    } else if (
      direction === 'top' &&
      heroRef.current.getBoundingClientRect().top < 
      mapContainerRef.current.getBoundingClientRect().top
    ) {
      scrollSmoothly(-scrollLength, -1);
    }
  };

  const getCoordinate = (stepLength: number) => {
    const x = heroPosition.top / stepLength;
    const y = heroPosition.left / stepLength;
    
    return { x, y };
  }

  const willCollide = (currentPosition: any, direction: string) => {
    let { x, y } = currentPosition;

    if (direction === 'left') {
      y -= 1;
    } else if (direction === 'right') {
      y += 1;
    } else if (direction === 'top') {
      x -= 1;
    } else if (direction === 'bottom') {
      x += 1;
    }
    // FIXME: if !unwalkable => walkable?
    return !withinRange(mapData.map[x][y], mapData.ele_description.walkable)
    && !withinRange(mapData.map[x][y], mapData.ele_description.tussock)
    && !withinRange(mapData.map[x][y], mapData.ele_description.flower)
    && !withinRange(mapData.map[x][y], mapData.ele_description.house_land)
    && !withinRange(mapData.map[x][y], mapData.ele_description.ground_top_1)
    && !withinRange(mapData.map[x][y], mapData.ele_description.ground_top_2)
    && !withinRange(mapData.map[x][y], mapData.ele_description.ground_top_3)
    && !withinRange(mapData.map[x][y], mapData.ele_description.ground_middle_1)
    && !withinRange(mapData.map[x][y], mapData.ele_description.ground_middle_2)
    && !withinRange(mapData.map[x][y], mapData.ele_description.ground_middle_3)
    && !withinRange(mapData.map[x][y], mapData.ele_description.ground_bottom_1)
    && !withinRange(mapData.map[x][y], mapData.ele_description.ground_bottom_2)
    && !withinRange(mapData.map[x][y], mapData.ele_description.ground_bottom_3)

  }


  const ifInRange = (npcX: number, npcY: number) => {
    const currentPosition = getCoordinate(stepLength);
    if ((currentPosition.x === npcX && (currentPosition.y - npcY == 1 || currentPosition.y - npcY == -1))
      || (currentPosition.y === npcY && (currentPosition.x - npcX == 1 || currentPosition.x - npcX == -1))) {
      return true;
    }
    return false;
  }

  const onInteract = async (npcX: number, npcY: number) => {
    const currentPosition = getCoordinate(stepLength);
    // check if npc is in range
    if ((currentPosition.x === npcX && (currentPosition.y - npcY == 1 || currentPosition.y - npcY == -1))
      || (currentPosition.y === npcY && (currentPosition.x - npcX == 1 || currentPosition.x - npcX == -1))) {
      // await interactNpc({x: npcX, y: npcY});
      const targetBlock = mapData.map[npcX][npcY];
      if (withinRange(targetBlock, mapData.ele_description.sprite)) {
        await interactNpc({ x: npcX, y: npcY });
      } else if (withinRange(targetBlock, mapData.ele_description.object)) {
        openTreasureBox({ x: npcX, y: npcY });
      // } else if (withinRange(targetBlock, mapData.ele_description.obelisk_bottom)) {
      //   openTreasureBox({ x: npcX, y: npcY });
      // } else if (withinRange(targetBlock, mapData.ele_description.old_man)) {
      //   openTreasureBox({ x: npcX, y: npcY });
      // } else if (withinRange(targetBlock, mapData.ele_description.fat_man)) {
      //   openTreasureBox({ x: npcX, y: npcY });
      }      
    }
  }

  const interact = async (direction: string) => {
    if (!direction) {
      return;
    }

    const currentPosition = getCoordinate(stepLength);
    switch (direction) {
      case 'left':
        targetPosition = {
          x: currentPosition.x,
          y: currentPosition.y - 1,
        }
        break;
      case 'right':
        targetPosition = {
          x: currentPosition.x,
          y: currentPosition.y + 1,
        }
        break;
      case 'top':
        targetPosition = {
          x: currentPosition.x - 1,
          y: currentPosition.y,
        }
        break;
      case 'bottom':
        targetPosition = {
          x: currentPosition.x + 1,
          y: currentPosition.y,
        }
        break;
      default:
        break;
    }
    const targetBlock = mapData.map[targetPosition.x][targetPosition.y];
    if (withinRange(targetBlock, mapData.ele_description.sprite)) {
      await interactNpc(targetPosition);
    } else if (withinRange(targetBlock, mapData.ele_description.object)) {
      openTreasureBox(targetPosition);
    } else if (withinRange(targetBlock, mapData.ele_description.obelisk_bottom)) {
      await interactNpc(targetPosition);
    } else if (withinRange(targetBlock, mapData.ele_description.old_man)) {
      await interactOldManNpc(targetPosition);
    } else if (withinRange(targetBlock, mapData.ele_description.fat_man)) {
      await interactOldManNpc(targetPosition);
    } else if (withinRange(targetBlock, mapData.ele_description.big_house_33)) {
      await interactHouseDoor();
    } else if (withinRange(targetBlock, mapData.ele_description.small_house_24)) {
      await interactHouseDoor();
    }
  }

  const interactNpc = async (targetPosition) => {
    const interactResponse = await getInteractResponse(targetPosition, mapSeed.blockNumber);
    console.log(interactResponse)
    // if (interactResponse.error_code === 0) {
      // const dialogContent = interactResponse.result.event.payload.first;
      const dialogContent = interactResponse
      showNpcDialog(dialogContent);
    // }
  }

  const interactOldManNpc = async (targetPosition) => {
    const interactResponse = await getOldManResponse(targetPosition, mapSeed.blockNumber);
    const dialogContent = interactResponse
    showNpcDialog(dialogContent);
  }

  const interactHouseDoor = async () => {
    showNpcDialog({
      text: "We're renovating now.",
      btn: {
        yes: "Good",
        no: "see you"
      }
    })
  }

  const interactSaveingWorld = async () => {
    showNpcDialog({
      text: "Saving...",
      btn: {
        yes: "yes",
        no: "go"
      }
    })
  }

  const showNpcDialog = (dialogContent: any) => {
    marked.setOptions({
      gfm: true,
      breaks: true,
    })
    dispatch(setDialog({display: true, content: marked.parse(dialogContent.text), yesContent: dialogContent.btn.yes, noContent: dialogContent.btn.no}));
  }

  const openTreasureBox = (targetPosition) => {
    let key = `${targetPosition.x}-${targetPosition.y}`;
    let _unboxState = {...unboxState};
    _unboxState[key] = true;
    setUnboxState(_unboxState);
    // FIXME: use data to change element
    const treasureBox = document
      .querySelectorAll('.map-row')[targetPosition.x]
      .children.item(targetPosition.y);

    treasureBox.className = treasureBox.className.replace('treasure-locked', 'treasure-unlocked');
    treasureBox.children[0]["src"] = require('../assets/img/block/treasure-unlocked-1.png');
  }

  const getInteractResponse = async (targetPosition, blockNumber) => {
    const { x, y } = targetPosition;
    
    // let interactApi = `https://indexer.obelisk.build?x=${y}&y=${x}&block_height=${blockNumber}`;

    // let interactResponse = await axios
    //   .get(interactApi)
    //   .catch((err) => {
    //     console.log(err);
    //   });

    // return interactResponse.data;
    return {
      text: "hello, obelisk!",
      btn: {
        yes: "yes",
        no: "no"
      }
    }
  }

  const getOldManResponse = async (targetPosition, blockNumber) => {
    const { x, y } = targetPosition;
    
    return {
      text: "Please look forward to our future updates!",
      btn: {
        yes: "I will",
        no: "no"
      }
    }
  }


  useEffect(() => {
    const metadata = {"entity_key":{"fileFormatVersion":6,"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"entity_key","friends":[],"structs":{},"exposedFunctions":{"from_bytes":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Vector":"U8"}],"return":["Address"]},"from_object":{"visibility":"Public","isEntry":false,"typeParameters":[{"abilities":["Store","Key"]}],"parameters":[{"Reference":{"TypeParameter":0}}],"return":["Address"]},"from_position":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":["U64","U64"],"return":["Address"]},"from_u256":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":["U256"],"return":["Address"]}}},"init":{"fileFormatVersion":6,"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"init","friends":[],"structs":{},"exposedFunctions":{}},"map_comp":{"fileFormatVersion":6,"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"map_comp","friends":[{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"move_system"}],"structs":{"CompMetadata":{"abilities":{"abilities":["Store"]},"typeParameters":[],"fields":[{"name":"id","type":"Address"},{"name":"name","type":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}},{"name":"types","type":{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}},{"name":"entity_key_to_index","type":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address","U64"]}}},{"name":"entities","type":{"Struct":{"address":"0x2","module":"table_vec","name":"TableVec","typeArguments":["Address"]}}},{"name":"data","type":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address",{"Vector":"U8"}]}}}]}},"exposedFunctions":{"data":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":[{"Reference":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address",{"Vector":"U8"}]}}}]},"decode":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Vector":"U8"}],"return":[{"Vector":{"Vector":"U8"}}]},"encode":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Vector":{"Vector":"U8"}}],"return":[{"Vector":"U8"}]},"entities":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":[{"Reference":{"Struct":{"address":"0x2","module":"table_vec","name":"TableVec","typeArguments":["Address"]}}}]},"entity_length":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":["U64"]},"get":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":[{"Vector":{"Vector":"U8"}}]},"id":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":["Address"]},"name":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":[{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}]},"new":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"map_comp","name":"CompMetadata","typeArguments":[]}}]},"register":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[]},"types":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":[{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}]},"update":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"Vector":{"Vector":"U8"}}],"return":[]}}},"movable_comp":{"fileFormatVersion":6,"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"movable_comp","friends":[{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"move_system"}],"structs":{"CompMetadata":{"abilities":{"abilities":["Store"]},"typeParameters":[],"fields":[{"name":"id","type":"Address"},{"name":"name","type":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}},{"name":"types","type":{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}},{"name":"entity_key_to_index","type":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address","U64"]}}},{"name":"entities","type":{"Struct":{"address":"0x2","module":"table_vec","name":"TableVec","typeArguments":["Address"]}}},{"name":"data","type":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address",{"Vector":"U8"}]}}}]}},"exposedFunctions":{"add":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address","Bool"],"return":[]},"contains":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":["Bool"]},"data":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":[{"Reference":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address",{"Vector":"U8"}]}}}]},"decode":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Vector":"U8"}],"return":["Bool"]},"encode":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":["Bool"],"return":[{"Vector":"U8"}]},"entities":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":[{"Reference":{"Struct":{"address":"0x2","module":"table_vec","name":"TableVec","typeArguments":["Address"]}}}]},"entity_length":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":["U64"]},"get":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":["Bool"]},"id":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":["Address"]},"name":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":[{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}]},"new":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"movable_comp","name":"CompMetadata","typeArguments":[]}}]},"register":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[]},"remove":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":[]},"types":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":[{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}]},"update":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address","Bool"],"return":[]}}},"move_system":{"fileFormatVersion":6,"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"move_system","friends":[],"structs":{},"exposedFunctions":{"down":{"visibility":"Public","isEntry":true,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[]},"left":{"visibility":"Public","isEntry":true,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[]},"register":{"visibility":"Public","isEntry":true,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[]},"right":{"visibility":"Public","isEntry":true,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[]},"up":{"visibility":"Public","isEntry":true,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[]}}},"player_comp":{"fileFormatVersion":6,"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"player_comp","friends":[{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"move_system"}],"structs":{"CompMetadata":{"abilities":{"abilities":["Store"]},"typeParameters":[],"fields":[{"name":"id","type":"Address"},{"name":"name","type":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}},{"name":"types","type":{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}},{"name":"entity_key_to_index","type":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address","U64"]}}},{"name":"entities","type":{"Struct":{"address":"0x2","module":"table_vec","name":"TableVec","typeArguments":["Address"]}}},{"name":"data","type":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address",{"Vector":"U8"}]}}}]}},"exposedFunctions":{"add":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address","Bool"],"return":[]},"contains":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":["Bool"]},"data":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":[{"Reference":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address",{"Vector":"U8"}]}}}]},"decode":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Vector":"U8"}],"return":["Bool"]},"encode":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":["Bool"],"return":[{"Vector":"U8"}]},"entities":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":[{"Reference":{"Struct":{"address":"0x2","module":"table_vec","name":"TableVec","typeArguments":["Address"]}}}]},"entity_length":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":["U64"]},"get":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":["Bool"]},"id":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":["Address"]},"name":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":[{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}]},"new":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"player_comp","name":"CompMetadata","typeArguments":[]}}]},"register":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[]},"remove":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":[]},"types":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":[{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}]},"update":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address","Bool"],"return":[]}}},"position_comp":{"fileFormatVersion":6,"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"position_comp","friends":[{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"move_system"}],"structs":{"CompMetadata":{"abilities":{"abilities":["Store"]},"typeParameters":[],"fields":[{"name":"id","type":"Address"},{"name":"name","type":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}},{"name":"types","type":{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}},{"name":"entity_key_to_index","type":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address","U64"]}}},{"name":"entities","type":{"Struct":{"address":"0x2","module":"table_vec","name":"TableVec","typeArguments":["Address"]}}},{"name":"data","type":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address",{"Vector":"U8"}]}}}]}},"exposedFunctions":{"add":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address","U64","U64"],"return":[]},"contains":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":["Bool"]},"data":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":[{"Reference":{"Struct":{"address":"0x2","module":"table","name":"Table","typeArguments":["Address",{"Vector":"U8"}]}}}]},"decode":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Vector":"U8"}],"return":["U64","U64"]},"encode":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":["U64","U64"],"return":[{"Vector":"U8"}]},"entities":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":[{"Reference":{"Struct":{"address":"0x2","module":"table_vec","name":"TableVec","typeArguments":["Address"]}}}]},"entity_length":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":["U64"]},"get":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":["U64","U64"]},"get_x":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":["U64"]},"get_y":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":["U64"]},"id":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":["Address"]},"name":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":[{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}]},"new":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"position_comp","name":"CompMetadata","typeArguments":[]}}]},"register":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[]},"remove":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":[]},"types":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[],"return":[{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}]},"update":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address","U64","U64"],"return":[]},"update_x":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address","U64"],"return":[]},"update_y":{"visibility":"Friend","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address","U64"],"return":[]}}},"world":{"fileFormatVersion":6,"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","name":"world","friends":[],"structs":{"AdminCap":{"abilities":{"abilities":["Key"]},"typeParameters":[],"fields":[{"name":"id","type":{"Struct":{"address":"0x2","module":"object","name":"UID","typeArguments":[]}}}]},"CompAddField":{"abilities":{"abilities":["Copy","Drop"]},"typeParameters":[],"fields":[{"name":"comp","type":"Address"},{"name":"key","type":"Address"},{"name":"data","type":{"Vector":"U8"}}]},"CompRegister":{"abilities":{"abilities":["Copy","Drop"]},"typeParameters":[],"fields":[{"name":"comp","type":"Address"},{"name":"compname","type":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}},{"name":"types","type":{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}}]},"CompRemoveField":{"abilities":{"abilities":["Copy","Drop"]},"typeParameters":[],"fields":[{"name":"comp","type":"Address"},{"name":"key","type":"Address"}]},"CompUpdateField":{"abilities":{"abilities":["Copy","Drop"]},"typeParameters":[],"fields":[{"name":"comp","type":"Address"},{"name":"key","type":{"Struct":{"address":"0x1","module":"option","name":"Option","typeArguments":["Address"]}}},{"name":"data","type":{"Vector":"U8"}}]},"World":{"abilities":{"abilities":["Store","Key"]},"typeParameters":[],"fields":[{"name":"id","type":{"Struct":{"address":"0x2","module":"object","name":"UID","typeArguments":[]}}},{"name":"name","type":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}},{"name":"description","type":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}},{"name":"comps","type":{"Struct":{"address":"0x2","module":"bag","name":"Bag","typeArguments":[]}}},{"name":"compnames","type":{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}},{"name":"admin","type":{"Struct":{"address":"0x2","module":"object","name":"ID","typeArguments":[]}}},{"name":"version","type":"U64"}]}},"exposedFunctions":{"add_comp":{"visibility":"Public","isEntry":false,"typeParameters":[{"abilities":["Store"]}],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"Vector":"U8"},{"TypeParameter":0}],"return":[]},"compnames":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":[{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}]},"contains":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":["Bool"]},"create":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}},{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}},{"MutableReference":{"Struct":{"address":"0x2","module":"tx_context","name":"TxContext","typeArguments":[]}}}],"return":[{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}]},"emit_add_event":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":["Address","Address",{"Vector":"U8"}],"return":[]},"emit_register_event":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Vector":"U8"},{"Vector":{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}}}],"return":[]},"emit_remove_event":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":["Address","Address"],"return":[]},"emit_update_event":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":["Address",{"Struct":{"address":"0x1","module":"option","name":"Option","typeArguments":["Address"]}},{"Vector":"U8"}],"return":[]},"get_comp":{"visibility":"Public","isEntry":false,"typeParameters":[{"abilities":["Store"]}],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":[{"Reference":{"TypeParameter":0}}]},"get_mut_comp":{"visibility":"Public","isEntry":false,"typeParameters":[{"abilities":["Store"]}],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},"Address"],"return":[{"MutableReference":{"TypeParameter":0}}]},"info":{"visibility":"Public","isEntry":false,"typeParameters":[],"parameters":[{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}}],"return":[{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}},{"Struct":{"address":"0x1","module":"ascii","name":"String","typeArguments":[]}},"U64"]},"migrate":{"visibility":"Private","isEntry":true,"typeParameters":[],"parameters":[{"MutableReference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"World","typeArguments":[]}}},{"Reference":{"Struct":{"address":"0x8e14c42fb382bbc9d20c4b0181475896473ed3e2a2affc640b5e3a2c99fbe504","module":"world","name":"AdminCap","typeArguments":[]}}}],"return":[]}}}} as SuiMoveNormalizedModules
    const obelisk = new Obelisk({
        networkType: NETWORK,
        packageId: PACKAGE_ID,
        metadata: metadata,
        secretKey:PRIVATEKEY
    });
    const onKeyDown = async (ev: any) => {
      // var ev = ev || event;
      var keyCode = ev.keyCode;
      switch (keyCode) {
        case 37:
          ev.preventDefault();
          direction = 'left';
          setHeroImg(playerSprites["A"])
          move(direction, stepLength);
          break;
        case 38:
          ev.preventDefault();
          direction = 'top';     
          setHeroImg(playerSprites["W"])
          move(direction, stepLength);
          break;
        case 39:
          ev.preventDefault();
          direction = 'right';  
          setHeroImg(playerSprites["D"])
          move(direction, stepLength);
          break;
        case 40:
          ev.preventDefault();
          direction = 'bottom';      
          setHeroImg(playerSprites["S"])
          move(direction, stepLength);
          break;
        case 32:
          ev.preventDefault();
          interact(direction);
          break;
        case 33: // PageUp
        case 34: // PageDown
        case 35: // End
        case 36: // Home
          ev.preventDefault();
      }
    };

    const onKeyUp = (ev: any) => {
      // var ev = ev || event;
      var keyCode = ev.keyCode;
  
      switch (keyCode) {
        case 37:
          ev.preventDefault();
          direction = 'left';
          break;
        case 38:
          ev.preventDefault();
          direction = 'top';
          break;
        case 39:
          ev.preventDefault();
          direction = 'right';
          break;
        case 40:
          ev.preventDefault();
          direction = 'bottom';
          break;
        case 32:
          ev.preventDefault();
          break;
        default:
          ev.preventDefault();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return () => {
        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('keyup', onKeyUp);
    }
  }, [mapData, heroPosition, stepTransactions]);

  return (
    <div id="map-wrapper" >
      {mapData.map && <div style={{textAlign: 'center'}}>Hero position: ({heroPosition.left / stepLength}, {heroPosition.top / stepLength})</div>}
      <div id="original-map" hidden={mapData.map.length !== 0}>
        {Array.from(Array(rowNumber).keys()).map((row, rowId) => {
          return (<div className='original-map-row flex' key={rowId}>
            {Array.from(Array(32).keys()).map((n, i) => { return <div className='original-map-block flex' key={i}></div> })}
          </div>)
        })}
      </div>
      <div id="map-container" ref={mapContainerRef}>
        <div id="moving-block" hidden={mapData.map.length === 0} ref={heroRef} style={{ left: `${heroPosition.left}vw`, top: `${heroPosition.top}vw` }}>
          <div id="hero-name">{hero.name}</div>
          <div className='xiaozhi'>
          <img src={heroImg} alt="" />
          </div>
        </div>
        <div id="map">
          {mapData.map && mapData.map.map((row, rowId) => {
            return (<div className='map-row flex' key={rowId}>
              {Array.from(Array(32).keys()).map((n, j) => { return drawBlock(mapData.map, rowId, j, mapData.type, mapData.ele_description, j) })}
            </div>)
          })}
        </div>
      </div>
    </div>
  );
}

