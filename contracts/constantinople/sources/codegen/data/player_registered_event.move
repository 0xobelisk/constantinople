  // Copyright (c) Obelisk Labs, Inc.
  // SPDX-License-Identifier: Apache-2.0
  #[allow(unused_use)]
  
  /* Autogenerated file. Do not edit manually. */
  
  module constantinople::player_registered_event {

  use sui::event;

  use std::ascii::String;

  use constantinople::monster_type::MonsterType;

  use constantinople::monster_catch_result::MonsterCatchResult;

  use constantinople::choice::Choice;

  use constantinople::game_result::GameResult;

  use constantinople::map_config::MapConfig;

  use constantinople::position::Position;

  use constantinople::encounter_info::EncounterInfo;

  public struct PlayerRegisteredEvent has copy, drop {
    player: address,
    position: Position,
  }

  public fun new(player: address, position: Position): PlayerRegisteredEvent {
    PlayerRegisteredEvent {
                                   player,position
                               }
  }
}
