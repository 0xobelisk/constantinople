module constantinople::map_system;

use constantinople::schema::Schema;
use sui::address;
use sui::random::{Random, RandomGenerator};
use sui::random;
use constantinople::encounter_info;
use constantinople::position;
use constantinople::monster_type;
use constantinople::events::player_registered_event;
use constantinople::errors::{space_obstructed_error, already_registered_error, not_registered_error,
    already_in_encounter_error, cannot_move_error, invalid_direction_error
};
use constantinople::balance_system;

entry fun register(schema: &mut Schema,  x: u64, y: u64, ctx: &TxContext) {
    let player = ctx.sender();

    already_registered_error(!schema.player().contains(player));
    // Constrain position to map size, wrapping around if necessary
    let (width, height, _) = schema.map_config().get().get();
    let x = (x + width) % width;
    let y = (y + height) % height;

    let position = position::new(x, y);
    space_obstructed_error(!schema.obstruction().contains(position));

    schema.player().set(player, true);
    schema.moveable().set(player, true);
    schema.encounterable().set(player, true);
    schema.position().set(player, position);
    player_registered_event(player, position);
}

fun start_encounter(schema: &mut Schema, generator: &mut RandomGenerator, player: address) {
    let rand = random::generate_u256(generator);
    // TODO: Monster levels have different refresh rates.
    let monster_type = match (rand % 4) {
        1 => monster_type::new_eagle(),
        2 => monster_type::new_rat(),
        3 => monster_type::new_caterpillar(),
        _ => monster_type::new_none(),
    };

    let monster = address::from_u256(schema.next_monster_id()[]);
    schema.monster().set(monster, monster_type);
    schema.encounter().set(player, encounter_info::new(monster, 0));
}


entry fun move_position(schema: &mut Schema, random: &Random, direction: u8, ctx: &mut TxContext) {
    let player = ctx.sender();
    not_registered_error(schema.player().contains(player));
    cannot_move_error(schema.moveable().contains(player));
    already_in_encounter_error(!schema.encounter().contains(player));

    let (mut x, mut y) = schema.position()[player].get();
    match (direction) {
        0 => y = y - 1,
        1 => y = y + 1,
        2 => x = x - 1,
        3 => x = x + 1,
        _ => invalid_direction_error(false),
    };

    // Constrain position to map size, wrapping around if necessary
    let (width, height, _) = schema.map_config()[].get();
    let x = (x + width) % width;
    let y = (y + height) % height;

    let position = position::new(x, y);
    space_obstructed_error(!schema.obstruction().contains(position));

    schema.position().set(player, position);

    if(schema.encounter_trigger().contains(position)) {
        let mut generator = random::new_generator(random, ctx);
        let rand = random::generate_u128(&mut generator);
        std::debug::print(&rand);
        if (rand % 2 == 0) {
            start_encounter(schema, &mut generator, player);
        }
    } else {
        balance_system::add_balance(schema, player, 1);
    }
}

// #[test_only]
// use constantinople::init_test;
// #[test_only]
// use sui::test_scenario;
//
// #[test]
// fun move_position_should_work(){
//     let (mut scenario, dapp) = init_test::deploy_dapp_for_testing(@0x0);
//     let mut schema = test_scenario::take_shared<Schema>(&scenario);
//     {
//         random::create_for_testing(scenario.ctx());
//         scenario.next_tx(@0xA);
//     };
//     let random = test_scenario::take_shared<Random>(&scenario);
//
//     let ctx = test_scenario::ctx(&mut scenario);
//     register(&mut schema, 8, 3, ctx);
//
//     move_position(&mut schema, &random, 1, ctx);
//     assert!(schema.position()[ctx.sender()] == position::new(8, 4));
//     assert!(schema.balance()[ctx.sender()] == 1);
//
//     move_position(&mut schema, &random, 1, ctx);
//     assert!(schema.position()[ctx.sender()] == position::new(8, 5));
//     assert!(schema.balance()[ctx.sender()] == 2);
//
//     // 23140719614837502849299678247283568217
//     // 265323129722700274815559996314403104838
//     // 167645769845140257622894197850400210971
//     // 337352614844298231097611607824428697695
//     // 143043683458825263308720013747056599257
//     // 97853292883519077516783190366887388411
//     // 226059294092153697833364734032968362880
//
//     move_position(&mut schema, &random, 3, ctx);
//     move_position(&mut schema, &random, 3, ctx);
//     assert!(schema.balance()[ctx.sender()] == 2);
//     let expect_monster_address = @0x0;
//     let expect_monster_type = monster_type::new_rat();
//     assert!(schema.monster().get(expect_monster_address) == expect_monster_type);
//     assert!(schema.encounter().get(ctx.sender()) == encounter_info::new(expect_monster_address, 0));
//
//     test_scenario::return_shared(schema);
//     test_scenario::return_shared(random);
//     dapp.distroy_dapp_for_testing();
//     scenario.end();
// }