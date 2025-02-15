module constantinople::rock_paper_scissors_system;

use constantinople::game_result;
use constantinople::game_result::GameResult;
use constantinople::choice::Choice;
use constantinople::schema::Schema;
use constantinople::choice;
use constantinople::events::{
    choice_made_event
};
use constantinople::balance_system;
use constantinople::errors::{
    invalid_choice_error
};
use sui::random::Random;
use sui::random;

entry fun start_game(schema: &mut Schema, player_choice: u8, random: &Random, ctx: &mut TxContext) {
    let player = ctx.sender();

    // TODO : Can only be played in a designated location.

    invalid_choice_error(player_choice < 3);

    let mut generator = random::new_generator(random, ctx);
    let rand = random::generate_u128(&mut generator);
    let contract_choice = match (rand % 3) {
        0 => choice::new_rock(),
        1 => choice::new_paper(),
        2 => choice::new_scissors(),
        _ => choice::new_rock(),
    };

    let player_choice = match (player_choice) {
        0 => choice::new_rock(),
        1 => choice::new_paper(),
        2 => choice::new_scissors(),
        _ => choice::new_rock(),
    };

    let _win = game_result::new_win();
    let _lose = game_result::new_lose();
    let _draw = game_result::new_draw();
    let result = determine_winner(player_choice, contract_choice);
    match (result) {
            _win => {
            balance_system::add_balance(schema, player, 50);
            choice_made_event(player, player_choice, contract_choice, _win);
        },
            _lose => {
            choice_made_event(player, player_choice, contract_choice, _lose);
        },
            _draw => {
            choice_made_event(player, player_choice, contract_choice, _draw);
        }
    };
}

fun determine_winner(player_choice: Choice, contract_choice: Choice): GameResult {
    if (player_choice == contract_choice) {
        return game_result::new_draw()
    };

    if (
        (player_choice == choice::new_rock() && contract_choice == choice::new_scissors()) ||
        (player_choice == choice::new_scissors() && contract_choice == choice::new_paper()) ||
        (player_choice == choice::new_paper() && contract_choice == choice::new_rock())
    ) {
        return game_result::new_win()
    };

    game_result::new_lose()
}
