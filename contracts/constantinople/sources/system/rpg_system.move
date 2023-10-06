module constantinople::rpg_system {
    use std::vector;
    use constantinople::ownedmonsters_comp;
    use constantinople::monster_comp;
    use sui::address;
    use constantinople::randomseed_comp;
    use sui::hash::keccak256;
    use sui::bcs;
    use constantinople::encounterable_comp;
    use constantinople::encountertrigger_comp;
    use constantinople::encounter_comp;
    use constantinople::obstruction_comp;
    use constantinople::entity_key;
    use constantinople::map_comp;
    use constantinople::movable_comp;
    use constantinople::position_comp;
    use constantinople::world::World;
    use constantinople::player_comp;
    use sui::tx_context;
    use sui::tx_context::TxContext;
    #[test_only]
    use constantinople::init;
    #[test_only]
    use sui::test_scenario;
    #[test_only]
    use sui::test_scenario::Scenario;

    const Caught: u8 = 0;
    const Fled: u8 = 1;
    const Missed: u8 = 2;

    public entry fun init_map(world: &mut World) {
        let map = map_comp::get(world);

        let height = vector::length(&map);
        let width = vector::length(vector::borrow(&map, 0));

        let y = 0;
        while (y < height) {
            let x = 0;
            while (x < width) {
                let value = *vector::borrow(vector::borrow(&map, y), x);
                let entity = entity_key::from_position(x, y);
                if (value == 20) {
                    encountertrigger_comp::add(world, entity, true);
                };
                if (value >= 40) {
                    obstruction_comp::add(world, entity, true);
                };
                x = x + 1;
            };
            y = y + 1;
        };

        map_comp::update(world, map);
    }

    public entry fun register(world: &mut World, x: u64, y: u64, ctx: &mut TxContext) {
        let player = tx_context::sender(ctx);
        // error already register
        assert!(!player_comp::contains(world, player), 0);

        let position = entity_key::from_position(x, y);
        // error this space is obstructed
        assert!(!obstruction_comp::contains(world, position), 0);

        player_comp::add(world, player, true);
        position_comp::add(world, player, x, y);
        movable_comp::add(world, player, true);
        encounterable_comp::add(world, player, true);
    }

    public fun move_t(world: &mut World, x: u64, y: u64, ctx: &mut TxContext): bool {
        let player = tx_context::sender(ctx);
        // error cannot move
        assert!(movable_comp::get(world, player), 0);

        // // error cannot move during an encounter
        assert!(!encounter_comp::contains(world, player), 0);

        let (from_x, from_y) = position_comp::get(world, player);
        // error can only move to adjacent spaces
        assert!(distance(from_x, from_y, x, y) == 1, 0);

        let position = entity_key::from_position(x, y);
        // error this space is obstructed
        assert!(!obstruction_comp::contains(world, position), 0);

        position_comp::update(world, player, x, y);

        if (encounterable_comp::contains(world, player) && encountertrigger_comp::contains(world, position)) {
            let (random, monster) = random(world, player, position);
            if (random % 3 == 0) {
                start_encounter(world, player, monster);
                return true
            };
        };
        return false
    }

    public fun throw_ball(world: &mut World, ctx: &mut TxContext): u8 {
        let player = tx_context::sender(ctx);
        // error not in encounter
        assert!(encounter_comp::contains(world, player), 0);

        let (_, monster, catch_attempts) = encounter_comp::get(world, player);
        let (random, monster) = random(world, player, monster);
        if (random % 2 == 0) {
            // 50% chance to catch monster
            // MonsterCatchAttempt.emitEphemeral(player, MonsterCatchResult.Caught);
            if(ownedmonsters_comp::contains(world, player)) {
                let owned_monsters = ownedmonsters_comp::get(world, player);
                vector::push_back(&mut owned_monsters, monster);
                ownedmonsters_comp::update(world, player, owned_monsters);
            } else {
                ownedmonsters_comp::add(world, player, vector[monster]);
            };
            encounter_comp::remove(world, player);
            Caught
        } else if (catch_attempts >= 2) {
            // Missed 2 times, monster escapes
            monster_comp::remove(world, monster);
            encounter_comp::remove(world, player);
            Fled
        } else {
            // Throw missed!
            encounter_comp::update_catchAttempts(world, player, catch_attempts + 1);
            Missed
        }
    }

    public fun flee(world: &mut World, ctx: &mut TxContext) {
        let player = tx_context::sender(ctx);

        // error not in encounter
        assert!(encounter_comp::contains(world, player), 0);

        let monster = encounter_comp::get_monster(world, player);

        monster_comp::remove(world, monster);
        encounter_comp::remove(world, player);
    }

    fun start_encounter(world: &mut World, player: address, monster: address) {
        let monster_type = bytes_to_u64(address::to_bytes(monster)) % 3;
        monster_comp::add(world, monster, monster_type);
        encounter_comp::add(world, player, true, monster, 0);
    }

    fun distance(from_x: u64, from_y: u64, to_x: u64, to_y: u64) : u64 {
        let delta_x = if(from_x > to_x) {from_x - to_x } else { to_x - from_x };
        let delta_y = if(from_y > to_y) { from_y - to_y } else { to_y - from_y };
        delta_x + delta_y
    }

    fun random(world: &mut World, player: address, position: address): (u64, address) {
        let random_seed = randomseed_comp::get(world);
        randomseed_comp::update(world, random_seed+1);
        let v = vector::empty<u8>();
        vector::append(&mut v, bcs::to_bytes(&player));
        vector::append(&mut v, bcs::to_bytes(&position));
        vector::append(&mut v, bcs::to_bytes(&random_seed));
        let hash = keccak256(&v);
        (
            bytes_to_u64(hash),
            address::from_bytes(hash)
        )
    }

    fun bytes_to_u64(bytes: vector<u8>): u64 {
        let value = 0u64;
        let i = 0u64;
        while (i < 8) {
            value = value | ((*vector::borrow(&bytes, i) as u64) << ((8 * (7 - i)) as u8));
            i = i + 1;
        };
        return value
    }

    #[test_only]
    public fun init_test(): Scenario {
        let scenario_val = test_scenario::begin(@0x0001);
        let scenario = &mut scenario_val;
        {
            let ctx = test_scenario::ctx(scenario);
            init::init_world_for_testing(ctx);
        };
        test_scenario::next_tx(scenario,@0x0001);
        scenario_val
    }

    #[test]
    public fun test_move_t()  {
        let scenario_val = init_test();
        let scenario = &mut scenario_val;

        let world = test_scenario::take_shared<World>(scenario);

        init_map(&mut world);

        test_scenario::next_tx(scenario,@0x551fda20060670358846d6ce061454d71dd2b174734010cca22aa378b672e736);

        register(&mut world, 8, 2, test_scenario::ctx(scenario));

        test_scenario::next_tx(scenario,@0x551fda20060670358846d6ce061454d71dd2b174734010cca22aa378b672e736);

        move_t(&mut world, 9, 2, test_scenario::ctx(scenario));

        test_scenario::next_tx(scenario,@0x551fda20060670358846d6ce061454d71dd2b174734010cca22aa378b672e736);
        let r = throw_ball(&mut world, test_scenario::ctx(scenario));
        debug::print(&r);

        let r = ownedmonsters_comp::get(&mut world, @0x551fda20060670358846d6ce061454d71dd2b174734010cca22aa378b672e736);
        debug::print(&r);

        test_scenario::next_tx(scenario,@0x551fda20060670358846d6ce061454d71dd2b174734010cca22aa378b672e736);
        move_t(&mut world, 9, 3, test_scenario::ctx(scenario));

        test_scenario::next_tx(scenario,@0x551fda20060670358846d6ce061454d71dd2b174734010cca22aa378b672e736);
        flee(&mut world, test_scenario::ctx(scenario));

        test_scenario::next_tx(scenario,@0x551fda20060670358846d6ce061454d71dd2b174734010cca22aa378b672e736);
        move_t(&mut world, 9, 4, test_scenario::ctx(scenario));


        test_scenario::return_shared<World>(world);
        test_scenario::end(scenario_val);
    }
}
