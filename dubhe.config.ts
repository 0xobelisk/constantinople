import { DubheConfig } from '@0xobelisk/sui-common';

export const dubheConfig = {
  name: 'constantinople',
  description: 'constantinople contract',
  data: {
    MonsterType: ["None", "Eagle", "Rat", "Caterpillar"],
    MonsterCatchResult: ["Missed", "Caught", "Fled"],
    Choice: ["Rock", "Paper", "Scissors"],
    GameResult: ["Win", "Lose", "Draw"],
    MapConfig: { width: "u64", height: "u64", terrain: "vector<vector<u8>>" },
    Position: { x: "u64", y: "u64" },
    EncounterInfo: { monster: "address", catch_attempts: "u64" }
  },
  errors: {
    CannotMove: "This entity cannot move",
    AlreadyRegistered: "This address is already registered" ,
    NotRegistered: "This address is not registered" ,
    SpaceObstructed: "This space is obstructed",
    AlreadyInEncounter: "This player already in an encounter",
    NotInEncounter: "This player is not in an encounter",
    InvalidDirection: "Invalid direction",
    InvalidChoice: "Invalid choice",
    BalanceTooLow: "Balance too low",
  },
  events: {
    PlayerRegistered: {
      player: 'address',
      position: 'Position'
    },
    MonsterCatchAttempt: {
      player: 'address',
      monster: 'address',
      result: 'MonsterCatchResult',
    },
    ChoiceMade: {
      player: 'address',
      player_choice: 'Choice',
      contract_choice: 'Choice',
      result: 'GameResult',
    }
  },
  schemas: {
      map_config: 'StorageValue<MapConfig>',
      next_monster_id: 'StorageValue<u256>',

      player: 'StorageMap<address, bool>',
      moveable: 'StorageMap<address, bool>',
      encounterable: 'StorageMap<address, bool>',
      monster: 'StorageMap<address, MonsterType>',
      owned_by: 'StorageMap<address, address>',
      position: 'StorageMap<address, Position>',
      balance: 'StorageMap<address, u256>',

      obstruction: 'StorageMap<Position, bool>',
      encounter_trigger: 'StorageMap<Position, bool>',

      encounter: 'StorageMap<address, EncounterInfo>',
  },
} as DubheConfig;
