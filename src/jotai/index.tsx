import { atom } from "jotai";

const SellPopUpBoxState = atom(false)
const SellState = atom({
    type:"",
    hash:"",
    state:false
})
const OpenBoxState = atom(false)
const Value = atom("")

const MapData = atom({
    map: [],
    type: "green",
    ele_description: {
      walkable: [0, 39],
      green: [0],
      tussock: [20],
      flower: [22],
      house_land: [23],

      ground_top_1: [30],
      ground_top_2: [31],
      ground_top_3: [32],
      ground_middle_1: [33],
      ground_middle_2: [34],
      ground_middle_3: [35],
      ground_bottom_1: [36],
      ground_bottom_2: [37],
      ground_bottom_3: [38],

      object: [40, 41],
      sprite: [42, 43],
      old_man: [43],
      fat_man: [44],

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
      small_tree: [83],
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

      house_stree: [161],
    },
    events: [],
    map_type: "event",
})

const ContractMetadata = atom({})

const SendTxLog = atom({
    display: false,
    content: "",
    yesContent: "",
    noContent: "",
    onYes: null,
    onNo: null,
  })

  const Dialog = atom({
    display: false,
    content: "",
    yesContent: "",
    noContent: "",
    onYes: null,
    onNo: null,
  })

const Hero = atom({
    name: "",
    position: { left: 0, top: 0 },
    lock: false
})

const Monster = atom({
    exist: false
})

const OwnedMonster = atom([])

const Account = atom({
    address: "",
    connected: false,
    loggedIn: false,
})

export { SellPopUpBoxState, SellState, OpenBoxState, Value,MapData, ContractMetadata, SendTxLog, Dialog, Hero, Monster, OwnedMonster, Account}
