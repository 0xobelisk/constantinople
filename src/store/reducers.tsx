import { createAsyncThunk, createSlice, PayloadAction, ThunkAction, AnyAction } from '@reduxjs/toolkit';
import { combineReducers } from 'redux'
import defaultState from './state'

// function progress (state = defaultState.progress, action: any) {
//   switch (action.type) {
//     case 'SET_PROGRESS':
//       return action.data
//     default:
//       return state
//   }
// }

// function page (state = defaultState.page, action: any) {
//   switch (action.type) {
//     case 'SET_PAGE':
//       return action.data
//     default:
//       return state
//   }
// }

function mapData (state = defaultState.mapData, action: any) {
  switch (action.type) {
    case 'SET_MAP_DATA':
      return action.data
    default:
      return state
  }
}

// function mapSeed (state = defaultState.mapSeed, action: any) {
//   switch (action.type) {
//     case 'SET_MAP_SEED':
//       return action.data
//     default:
//       return state
//   }
// }

// function mapNFT (state = defaultState.mapNFT, action: any) {
//   switch (action.type) {
//     case 'SET_MAP_NFT':
//       return action.data
//     default:
//       return state
//   }
// }

function dialog (state = defaultState.dialog, action: any) {
  switch (action.type) {
    case 'SET_DIALOG':
      return action.data
    default:
      return state
  }
}

// function alert (state = defaultState.alert, action: any) {
//   switch (action.type) {
//     case 'SET_ALERT':
//       return action.data
//     default:
//       return state
//   }
// }

function hero (state = defaultState.hero, action: any) {
  switch (action.type) {
    case 'SET_HERO':
      return action.data
    default:
      return state
  }
}

function account (state = defaultState.account, action: any) {
  switch (action.type) {
    case 'SET_ACCOUNT':
      return action.data
    default:
      return state
  }
}

export default combineReducers({
  // progress,
  // page,
  mapData,
  // mapSeed,
  // mapNFT,
  dialog,
  // alert,
  hero,
  account,
})