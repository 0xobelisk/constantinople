import { useEffect, useState, useRef, useMemo, ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setDialog } from "../store/actions";
import axios from 'axios';
import { marked } from 'marked';

export default function Map() {
  let dispatch = useDispatch();
  const treasureCount = 2;
  const spriteCount = 5;
  let dialog = useSelector(state => state['dialog']);

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


  async function loadSprites(imagesUrl){
      return (await Promise.all(imagesUrl.map(loadImage)))
  }
  
  const [heroImg, setHeroImg] = useState(playerSprites["S"])

  let [rowNumber, setRowNumber] = useState(1);
  let [unboxState, setUnboxState] = useState({});
  let mapData = useSelector(state => state["mapData"]);
  let mapSeed = useSelector(state => state["mapSeed"]);
  let hero = useSelector(state => state["hero"]);

  // fill screen with rows of block
  const calcOriginalMapRowNumber = function (height, width) {
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

  const withinRange = (value, arr) => {
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
      className = 'unwalkable';
      img = <img src={require('../assets/img/block/small-tree.jpg')} alt='unwalkable' />;
    } else if (withinRange(map[x][y], ele_description.flower)) {
      className = 'unwalkable';
      img = <img src={require('../assets/img/block/flower.gif')} alt='unwalkable' />;
    } else if (withinRange(map[x][y], ele_description.tree_top)) {
      className = 'unwalkable';
      img = <img src={require('../assets/img/block/tree_top.jpg')} alt='unwalkable' />;
    } else if (withinRange(map[x][y], ele_description.tree_bottom)) {
      className = 'unwalkable';
      img = <img src={require('../assets/img/block/tree_bottom.jpg')} alt='unwalkable' />;
    } else if (withinRange(map[x][y], ele_description.tussock)) {
      className = 'walkable tussock';
    } else if (withinRange(map[x][y], ele_description.ground_top_1)) {
      className = 'walkable';
      img = <img src={require('../assets/img/ground/50.png')} alt='walkable' />;
    } else if (withinRange(map[x][y], ele_description.ground_top_2)) {
      className = 'walkable';
      img = <img src={require('../assets/img/ground/51.png')} alt='walkable' />;
    } else if (withinRange(map[x][y], ele_description.ground_top_3)) {
      className = 'walkable';
      img = <img src={require('../assets/img/ground/52.png')} alt='walkable' />;
    } else if (withinRange(map[x][y], ele_description.ground_middle_1)) {
      className = 'walkable';
      img = <img src={require('../assets/img/ground/53.png')} alt='walkable' />;
    } else if (withinRange(map[x][y], ele_description.ground_middle_2)) {
      className = 'walkable';
      img = <img src={require('../assets/img/ground/54.png')} alt='walkable' />;
    } else if (withinRange(map[x][y], ele_description.ground_middle_3)) {
      className = 'walkable';
      img = <img src={require('../assets/img/ground/55.png')} alt='walkable' />;
    } else if (withinRange(map[x][y], ele_description.ground_bottom_1)) {
      className = 'walkable';
      img = <img src={require('../assets/img/ground/56.png')} alt='walkable' />;
    } else if (withinRange(map[x][y], ele_description.ground_bottom_2)) {
      className = 'walkable';
      img = <img src={require('../assets/img/ground/57.png')} alt='walkable' />;
    } else if (withinRange(map[x][y], ele_description.ground_bottom_3)) {
      className = 'walkable';
      img = <img src={require('../assets/img/ground/58.png')} alt='walkable' />;
    } else if (withinRange(map[x][y], ele_description.water_top_1)) {
      className = 'walkable';
      img = <img src={require('../assets/img/water/60.png')} alt='walkable' />;
    } else if (withinRange(map[x][y], ele_description.water_top_2)) {
      className = 'walkable';
      img = <img src={require('../assets/img/water/61.png')} alt='walkable' />;
    } else if (withinRange(map[x][y], ele_description.water_top_3)) {
      className = 'walkable';
      img = <img src={require('../assets/img/water/62.png')} alt='walkable' />;
    } else if (withinRange(map[x][y], ele_description.water_middle_1)) {
      className = 'walkable';
      img = <img src={require('../assets/img/water/63.png')} alt='walkable' />;
    } else if (withinRange(map[x][y], ele_description.water_middle_2)) {
      className = 'walkable';
      img = <img src={require('../assets/img/water/64.png')} alt='walkable' />;
    } else if (withinRange(map[x][y], ele_description.water_middle_3)) {
      className = 'walkable';
      img = <img src={require('../assets/img/water/65.png')} alt='walkable' />;
    } else if (withinRange(map[x][y], ele_description.water_bottom_1)) {
      className = 'walkable';
      img = <img src={require('../assets/img/water/66.png')} alt='walkable' />;
    } else if (withinRange(map[x][y], ele_description.water_bottom_2)) {
      className = 'walkable';
      img = <img src={require('../assets/img/water/67.png')} alt='walkable' />;
    } else if (withinRange(map[x][y], ele_description.water_bottom_3)) {
      className = 'walkable';
      img = <img src={require('../assets/img/water/68.png')} alt='walkable' />;


    } else if (withinRange(map[x][y], ele_description.big_house_1)) {
      className = 'walkable';
      img = <img src={require('../assets/img/big_house/house_1.png')} alt='walkable' />;


    } else if (withinRange(map[x][y], ele_description.big_house_2)) {
      className = 'walkable';
      img = <img src={require('../assets/img/big_house/house_2.png')} alt='walkable' />;


    } else if (withinRange(map[x][y], ele_description.big_house_3)) {
      className = 'walkable';
      img = <img src={require('../assets/img/big_house/house_3.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.big_house_4)) {
      className = 'walkable';
      img = <img src={require('../assets/img/big_house/house_4.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.big_house_5)) {
      className = 'walkable';
      img = <img src={require('../assets/img/big_house/house_5.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.big_house_6)) {
      className = 'walkable';
      img = <img src={require('../assets/img/big_house/house_6.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.big_house_7)) {
      className = 'walkable';
      img = <img src={require('../assets/img/big_house/house_7.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.big_house_8)) {
      className = 'walkable';
      img = <img src={require('../assets/img/big_house/house_8.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.big_house_9)) {
      className = 'walkable';
      img = <img src={require('../assets/img/big_house/house_9.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.big_house_10)) {
      className = 'walkable';
      img = <img src={require('../assets/img/big_house/house_10.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.big_house_11)) {
      className = 'walkable';
      img = <img src={require('../assets/img/big_house/house_11.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.big_house_12)) {
      className = 'walkable';
      img = <img src={require('../assets/img/big_house/house_12.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.big_house_13)) {
      className = 'walkable';
      img = <img src={require('../assets/img/big_house/house_13.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.big_house_14)) {
      className = 'walkable';
      img = <img src={require('../assets/img/big_house/house_14.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.big_house_15)) {
      className = 'walkable';
      img = <img src={require('../assets/img/big_house/house_15.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.big_house_16)) {
      className = 'walkable';
      img = <img src={require('../assets/img/big_house/house_16.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.big_house_17)) {
      className = 'walkable';
      img = <img src={require('../assets/img/big_house/house_17.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.big_house_18)) {
      className = 'walkable';
      img = <img src={require('../assets/img/big_house/house_18.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.big_house_19)) {
      className = 'walkable';
      img = <img src={require('../assets/img/big_house/house_19.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.big_house_20)) {
      className = 'walkable';
      img = <img src={require('../assets/img/big_house/house_20.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.big_house_21)) {
      className = 'walkable';
      img = <img src={require('../assets/img/big_house/house_21.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.big_house_22)) {
      className = 'walkable';
      img = <img src={require('../assets/img/big_house/house_22.png')} alt='walkable' />;


    } else if (withinRange(map[x][y], ele_description.big_house_23)) {
      className = 'walkable';
      img = <img src={require('../assets/img/big_house/house_23.png')} alt='walkable' />;


    } else if (withinRange(map[x][y], ele_description.big_house_24)) {
      className = 'walkable';
      img = <img src={require('../assets/img/big_house/house_24.png')} alt='walkable' />;


    } else if (withinRange(map[x][y], ele_description.big_house_25)) {
      className = 'walkable';
      img = <img src={require('../assets/img/big_house/house_25.png')} alt='walkable' />;


    } else if (withinRange(map[x][y], ele_description.big_house_26)) {
      className = 'walkable';
      img = <img src={require('../assets/img/big_house/house_26.png')} alt='walkable' />;


    } else if (withinRange(map[x][y], ele_description.big_house_27)) {
      className = 'walkable';
      img = <img src={require('../assets/img/big_house/house_27.png')} alt='walkable' />;


    } else if (withinRange(map[x][y], ele_description.big_house_28)) {
      className = 'walkable';
      img = <img src={require('../assets/img/big_house/house_28.png')} alt='walkable' />;


    } else if (withinRange(map[x][y], ele_description.big_house_29)) {
      className = 'walkable';
      img = <img src={require('../assets/img/big_house/house_29.png')} alt='walkable' />;


    } else if (withinRange(map[x][y], ele_description.big_house_30)) {
      className = 'walkable';
      img = <img src={require('../assets/img/big_house/house_30.png')} alt='walkable' />;


    } else if (withinRange(map[x][y], ele_description.big_house_31)) {
      className = 'walkable';
      img = <img src={require('../assets/img/big_house/house_31.png')} alt='walkable' />;


    } else if (withinRange(map[x][y], ele_description.big_house_32)) {
      className = 'walkable';
      img = <img src={require('../assets/img/big_house/house_32.png')} alt='walkable' />;


    } else if (withinRange(map[x][y], ele_description.big_house_33)) {
      const sprite = 'sprite' + randomState1[`${x}-${y}`];
      className = `unwalkable ${sprite}`;
      const npc_image = mapData.map_type == 'gallery' ? 'gallery_house' : sprite;
      img = <img src={require(`../assets/img/big_house/house_33.png`)} alt={npc_image} onClick={() => onInteract(x, y)}/>

    } else if (withinRange(map[x][y], ele_description.big_house_34)) {
      className = 'walkable';
      img = <img src={require('../assets/img/big_house/house_34.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.big_house_35)) {
      className = 'walkable';
      img = <img src={require('../assets/img/big_house/house_35.png')} alt='walkable' />;


    } else if (withinRange(map[x][y], ele_description.small_house_1)) {
      className = 'walkable';
      img = <img src={require('../assets/img/small_house/house_1.png')} alt='walkable' />;


    } else if (withinRange(map[x][y], ele_description.small_house_2)) {
      className = 'walkable';
      img = <img src={require('../assets/img/small_house/house_2.png')} alt='walkable' />;


    } else if (withinRange(map[x][y], ele_description.small_house_3)) {
      className = 'walkable';
      img = <img src={require('../assets/img/small_house/house_3.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.small_house_4)) {
      className = 'walkable';
      img = <img src={require('../assets/img/small_house/house_4.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.small_house_5)) {
      className = 'walkable';
      img = <img src={require('../assets/img/small_house/house_5.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.small_house_6)) {
      className = 'walkable';
      img = <img src={require('../assets/img/small_house/house_6.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.small_house_7)) {
      className = 'walkable';
      img = <img src={require('../assets/img/small_house/house_7.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.small_house_8)) {
      className = 'walkable';
      img = <img src={require('../assets/img/small_house/house_8.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.small_house_9)) {
      className = 'walkable';
      img = <img src={require('../assets/img/small_house/house_9.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.small_house_10)) {
      className = 'walkable';
      img = <img src={require('../assets/img/small_house/house_10.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.small_house_11)) {
      className = 'walkable';
      img = <img src={require('../assets/img/small_house/house_11.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.small_house_12)) {
      className = 'walkable';
      img = <img src={require('../assets/img/small_house/house_12.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.small_house_13)) {
      className = 'walkable';
      img = <img src={require('../assets/img/small_house/house_13.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.small_house_14)) {
      className = 'walkable';
      img = <img src={require('../assets/img/small_house/house_14.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.small_house_15)) {
      className = 'walkable';
      img = <img src={require('../assets/img/small_house/house_15.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.small_house_16)) {
      className = 'walkable';
      img = <img src={require('../assets/img/small_house/house_16.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.small_house_17)) {
      className = 'walkable';
      img = <img src={require('../assets/img/small_house/house_17.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.small_house_18)) {
      className = 'walkable';
      img = <img src={require('../assets/img/small_house/house_18.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.small_house_19)) {
      className = 'walkable';
      img = <img src={require('../assets/img/small_house/house_19.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.small_house_20)) {
      className = 'walkable';
      img = <img src={require('../assets/img/small_house/house_20.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.small_house_21)) {
      className = 'walkable';
      img = <img src={require('../assets/img/small_house/house_21.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.small_house_22)) {
      className = 'walkable';
      img = <img src={require('../assets/img/small_house/house_22.png')} alt='walkable' />;


    } else if (withinRange(map[x][y], ele_description.small_house_23)) {
      className = 'walkable';
      img = <img src={require('../assets/img/small_house/house_23.png')} alt='walkable' />;


    } else if (withinRange(map[x][y], ele_description.small_house_24)) {
      const sprite = 'sprite' + randomState1[`${x}-${y}`];
      className = `unwalkable ${sprite}`;
      const npc_image = mapData.map_type == 'gallery' ? 'gallery_house' : sprite;
      img = <img src={require(`../assets/img/small_house/house_24.png`)} alt={npc_image} onClick={() => onInteract(x, y)}/>
    } else if (withinRange(map[x][y], ele_description.small_house_25)) {
      className = 'walkable';
      img = <img src={require('../assets/img/small_house/house_25.png')} alt='walkable' />;


    } else if (withinRange(map[x][y], ele_description.house_land)) {
      className = 'walkable';
      img = <img src={require('../assets/img/block/land_1.png')} alt='walkable' />;
    } else if (withinRange(map[x][y], ele_description.house_stree)) {
      className = 'walkable';
      img = <img src={require('../assets/img/block/street_1.png')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.obelisk_top)) {
      className = 'walkable';
      img = <img src={require('../assets/img/block/obelisk1.jpg')} alt='walkable' />;
    } else if (withinRange(map[x][y], ele_description.obelisk_middle_1)) {
      className = 'walkable';
      img = <img src={require('../assets/img/block/obelisk2.jpg')} alt='walkable' />;
    } else if (withinRange(map[x][y], ele_description.obelisk_middle_2)) {
      className = 'walkable';
      img = <img src={require('../assets/img/block/obelisk3.jpg')} alt='walkable' />;
    // } else if (withinRange(map[x][y], ele_description.obelisk_bottom)) {
    //   className = 'walkable';
    //   img = <img src={require('../assets/img/block/obelisk4.jpg')} alt='walkable' />;



    } else if (withinRange(map[x][y], ele_description.obelisk_bottom)) {
      const sprite = 'sprite' + randomState1[`${x}-${y}`];
      className = `unwalkable ${sprite}`;
      const npc_image = mapData.map_type == 'gallery' ? 'gallery_house' : sprite;
      img = <img src={require(`../assets/img/block/obelisk4.jpg`)} alt={npc_image} onClick={() => onInteract(x, y)}/>


    } else if (withinRange(map[x][y], ele_description.obelisk_bottom_left)) {
      className = 'walkable';
      img = <img src={require('../assets/img/block/obelisk5.jpg')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.obelisk_bottom_right)) {
      className = 'walkable';
      img = <img src={require('../assets/img/block/obelisk6.jpg')} alt='walkable' />;

    } else if (withinRange(map[x][y], ele_description.old_man)) {
      const sprite = 'sprite' + randomState1[`${x}-${y}`];
      className = `unwalkable ${sprite} npc_man`;
      const npc_image = mapData.map_type == 'gallery' ? 'gallery_house' : sprite;
      img = <img src={require(`../assets/img/block/oldman.png`)} alt={npc_image} onClick={() => onInteract(x, y)}/>


    } else if (withinRange(map[x][y], ele_description.fat_man)) {
      const sprite = 'sprite' + randomState1[`${x}-${y}`];
      className = `unwalkable ${sprite}`;
      const npc_image = mapData.map_type == 'gallery' ? 'gallery_house' : sprite;
      img = <img src={require(`../assets/img/block/fatman.png`)} alt={npc_image} onClick={() => onInteract(x, y)}/>


    } else if (withinRange(map[x][y], ele_description.rocks)) {
      className = 'walkable';
      img = <img src={require('../assets/img/block/rocks.png')} alt='walkable' />;

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
    // console.log(className)
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

  const [heroPosition, setHeroPosition] = useState({left: 0, top: 0});

  // move moving-block when possible
  const move = (direction, stepLength) => {
    if (willCrossBorder(direction, stepLength)) {
      console.log('will cross border');
      return;
    }
    const currentPosition = getCoordinate(stepLength);
    if (willCollide(currentPosition, direction)) {
      console.log("collide");
      return;
    }
    // if (willCollide2)
    let left, top, index;
    switch (direction) {
      case 'left':
        left = heroPosition.left - stepLength;
        setHeroPosition({...heroPosition, left: left});
        break;
      case 'top':
        top = heroPosition.top - stepLength;
        setHeroPosition({...heroPosition, top: top});
        scrollIfNeeded('top');
        break;
      case 'right':
        left = heroPosition.left + stepLength;
        setHeroPosition({...heroPosition, left: left});
        break;
      case 'bottom':
        top = heroPosition.top + stepLength;
        setHeroPosition({...heroPosition, top: top});
        scrollIfNeeded('bottom');
        break;
      default:
        break;
    }
    
  };

  // check if moving-block will be out of map
  const willCrossBorder = (direction, stepLength) => {
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

  const scrollSmoothly = (scrollLength, scrollStep) => {
    const scrollInterval = setInterval(() => {
      mapContainerRef.current.scrollBy(0, scrollStep);
      scrollLength -= scrollStep;
      if (scrollLength === 0) {
        clearInterval(scrollInterval);
      }
    });
  };

  // scroll map when part of moving-block is out of wrapper
  const scrollIfNeeded = (direction) => {
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

  const getCoordinate = (stepLength) => {
    const x = heroPosition.top / stepLength;
    const y = heroPosition.left / stepLength;
    
    return { x, y };
  }

  const willCollide = (currentPosition, direction) => {
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


  const ifInRange = (npcX, npcY) => {
    const currentPosition = getCoordinate(stepLength);
    if ((currentPosition.x === npcX && (currentPosition.y - npcY == 1 || currentPosition.y - npcY == -1))
      || (currentPosition.y === npcY && (currentPosition.x - npcX == 1 || currentPosition.x - npcX == -1))) {
      return true;
    }
    return false;
  }

  const onInteract = async (npcX, npcY) => {
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

  const interact = async (direction) => {
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
    const onKeyDown = (ev) => {
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
  }, [mapData, heroPosition]);

  return (
    <div id="map-wrapper" >
      {mapData.map && <div style={{textAlign: 'center'}}>Hero position: ({heroPosition.left / 2.5}, {heroPosition.top / 2.5})</div>}
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

