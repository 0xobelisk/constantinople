import { AppThunk } from './index'

export function setProgress (data: any) {
    return (dispatch: any, getState: any) => {
      dispatch({ type: 'SET_PROGRESS', data: data })
    }
  }
  
  export function setPage (data: any) {
    return (dispatch: any, getState: any) => {
      dispatch({ type: 'SET_PAGE', data: data })
    }
  }
  
  export function setMapData (data: any) {
    return (dispatch: any, getState: any) => {
      dispatch({ type: 'SET_MAP_DATA', data: data })
    }
  }
  
  export function setMapSeed (data: any) {
    return (dispatch: any, getState: any) => {
      dispatch({ type: 'SET_MAP_SEED', data: data })
    }
  }
  
  export function setMapNFT (data: any) {
    return (dispatch: any, getState: any) => {
      dispatch({ type: 'SET_MAP_NFT', data: data })
    }
  }
  
  export const setDialog = (data: any) => 
  (dispatch: any, getState: any) => {
      dispatch({ type: 'SET_DIALOG', data: data })
  }

  export function setAlert (data: any) {
    return (dispatch: any, getState: any) => {
      dispatch({ type: 'SET_ALERT', data: data })
    }
  }
  
  export function setHero (data: any) {
    return (dispatch: any, getState: any) => {
      dispatch({ type: 'SET_HERO', data: data })
    }
  }
  
  export function setAccount (data: any) {
    return (dispatch: any, getState: any) => {
      dispatch({ type: 'SET_ACCOUNT', data: data })
    }
  }