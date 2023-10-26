module constantinople::map_system {
    use constantinople::map_schema;
    use constantinople::world::World;
    use constantinople::entity_key;
    use constantinople::encounter_trigger_schema;
    use constantinople::obstruction_schema;
    use sui::tx_context::TxContext;
    use sui::tx_context;
    use constantinople::player_schema;
    use constantinople::position_schema;
    use constantinople::movable_schema;
    use constantinople::encounterable_schema;
    use constantinople::encounter_schema;
    use sui::clock::Clock;
    use sui::clock;
    #[test_only]
    use sui::test_scenario;
    #[test_only]
    use sui::test_scenario::Scenario;
    #[test_only]
    use constantinople::init;
    #[test_only]
    use constantinople::world::AdminCap;
    #[test_only]
    use constantinople::deploy_hook::deploy_hook_for_testing;
    #[test_only]
    use sui::clock_tests;

    /// error already register
    const EAlreadyRegister: u64 = 0;
    /// error constrain position to map size
    const EExceedingMapLimits: u64 = 1;
    /// error this space is obstructed
    const EObstaclesExist: u64 = 2;
    ///  error cannot move
    const ECannotMove: u64 = 3;
    /// error cannot move during an encounter
    const ECannotMoveInEncounter: u64 = 4;
    /// error can only move to adjacent spaces
    const EOnlyMoveToAdjacentSpaces: u64 = 5;

    public entry fun register(world: &mut World, x: u64, y: u64, ctx: &mut TxContext) {
        let player = tx_context::sender(ctx);

        // error constrain position to map size
        let (width, height, _) = map_schema::get(world);
        assert!(x >= 0 && x <= width, EExceedingMapLimits);
        assert!(y >= 0 && y <= height, EExceedingMapLimits);

        // error already register
        assert!(!player_schema::contains(world, player), EAlreadyRegister);

        let position = entity_key::from_position(x, y);
        // error this space is obstructed
        assert!(!obstruction_schema::contains(world, position), EObstaclesExist);

        player_schema::set(world, player, true);
        position_schema::set(world, player, x, y);
        movable_schema::set(world, player, true);
        encounterable_schema::set(world, player, true);
    }

    public entry fun move_t(world: &mut World, x: u64, y: u64, clock: &Clock, ctx: &mut TxContext) {
        let player = tx_context::sender(ctx);

        // error constrain position to map size
        let (width, height, _) = map_schema::get(world);
        assert!(x >= 0 && x <= width, EExceedingMapLimits);
        assert!(y >= 0 && y <= height, EExceedingMapLimits);

        // error cannot move
        assert!(movable_schema::get(world, player), ECannotMove);

        // error cannot move during an encounter
        assert!(!encounter_schema::contains(world, player), ECannotMoveInEncounter);

        let (from_x, from_y) = position_schema::get(world, player);
        // error can only move to adjacent spaces
        assert!(distance(from_x, from_y, x, y) == 1, EOnlyMoveToAdjacentSpaces);

        let position = entity_key::from_position(x, y);
        // error this space is obstructed
        assert!(!obstruction_schema::contains(world, position), EObstaclesExist);

        position_schema::set(world, player, x, y);

        if (encounterable_schema::contains(world, player) && encounter_trigger_schema::contains(world, position)) {
            // Pass in the time as a random number
            let rand = clock::timestamp_ms(clock);
            if (rand % 2 == 0) {
                // Generate Monster
                let monster = entity_key::from_u256((rand as u256));
                // Start encounter
                encounter_schema::set(world, player, true, monster, 0);
            };
        };
    }

    fun distance(from_x: u64, from_y: u64, to_x: u64, to_y: u64) : u64 {
        let delta_x = if(from_x > to_x) {from_x - to_x } else { to_x - from_x };
        let delta_y = if(from_y > to_y) { from_y - to_y } else { to_y - from_y };
        delta_x + delta_y
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
    public fun test_create_world()  {
        let scenario_val = init_test();
        let scenario = &mut scenario_val;

        let world = test_scenario::take_shared<World>(scenario);
       let admin_cap = test_scenario::take_from_sender<AdminCap>(scenario);

        deploy_hook_for_testing(&mut world, &admin_cap);

        register(&mut world, 0 , 0, test_scenario::ctx(scenario));
        test_scenario::next_tx(scenario,@0x0001);

        let clock = clock::create_for_testing(test_scenario::ctx(scenario));
        move_t(&mut world, 0,1, &clock, test_scenario::ctx(scenario));

        clock::destroy_for_testing(clock);
        test_scenario::return_shared<World>(world);
        test_scenario::return_to_sender<AdminCap>(scenario,admin_cap);
        test_scenario::end(scenario_val);
    }
}
