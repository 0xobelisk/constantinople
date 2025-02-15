module constantinople::encounter_system;

use constantinople::schema::Schema;
use constantinople::monster_catch_result;
use constantinople::events::{
    monster_catch_attempt_event
};
use constantinople::errors::{
    not_in_encounter_error
};
use sui::random::Random;
use sui::random;

entry fun throw_ball(schema: &mut Schema, random: &Random, ctx: &mut TxContext) {
    let player = ctx.sender();

    not_in_encounter_error(schema.encounter().contains(player));

    let (monster, catch_attempts) = schema.encounter().get(player).get();

    let mut generator = random::new_generator(random, ctx);
    let rand = random::generate_u128(&mut generator);
    // std::debug::print(&rand);
    if (rand % 2 == 0) {
        // 50% chance to catch monster
        monster_catch_attempt_event(player, monster, monster_catch_result::new_caught());
        schema.owned_by().set(monster, player);
        schema.encounter().remove(player);
    } else if (catch_attempts >= 2) {
        // Missed 2 times, monster escapes
        monster_catch_attempt_event(player, monster, monster_catch_result::new_fled());
        schema.monster().remove(monster);
        schema.encounter().remove(player);
    } else {
        // Throw missed!
        monster_catch_attempt_event(player, monster, monster_catch_result::new_missed());
        let mut encounter_info = schema.encounter()[player];
        encounter_info.set_catch_attempts(catch_attempts + 1);
        schema.encounter().set(player, encounter_info);
    }
}

entry fun flee(schema: &mut Schema, ctx: &TxContext) {
    let player = ctx.sender();

    not_in_encounter_error(schema.encounter().contains(player));

    let encounter_info  = schema.encounter()[player];
    schema.monster().remove(encounter_info.get_monster());
    schema.encounter().remove(player);
}
