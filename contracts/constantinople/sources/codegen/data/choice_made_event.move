  // Copyright (c) Obelisk Labs, Inc.
  // SPDX-License-Identifier: Apache-2.0
  #[allow(unused_use)]
  
  /* Autogenerated file. Do not edit manually. */
  
  module constantinople::choice_made_event {

  use sui::event;

  use std::ascii::String;

  use constantinople::monster_type::MonsterType;

  use constantinople::monster_catch_result::MonsterCatchResult;

  use constantinople::choice::Choice;

  use constantinople::game_result::GameResult;

  use constantinople::map_config::MapConfig;

  use constantinople::position::Position;

  use constantinople::encounter_info::EncounterInfo;

  public struct ChoiceMadeEvent has copy, drop {
    player: address,
    player_choice: Choice,
    contract_choice: Choice,
    result: GameResult,
  }

  public fun new(player: address, player_choice: Choice, contract_choice: Choice, result: GameResult): ChoiceMadeEvent {
    ChoiceMadeEvent {
                                   player,player_choice,contract_choice,result
                               }
  }
}
