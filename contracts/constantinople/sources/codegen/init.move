module constantinople::init {
    use std::ascii::string;
    use sui::transfer;
    use sui::tx_context::TxContext;
    use constantinople::world;
    use constantinople::movable_comp;
    use constantinople::obstruction_comp;
    use constantinople::encounterable_comp;
    use constantinople::encountertrigger_comp;
    use constantinople::player_comp;
    use constantinople::encounter_comp;
    use constantinople::ownedmonsters_comp;
    use constantinople::monster_comp;
    use constantinople::position_comp;
    use constantinople::randomseed_comp;
    use constantinople::map_comp;

    fun init(ctx: &mut TxContext) {
        let world = world::create(string(b"Constantinople"), string(b"Constantinople"),ctx);

        // Add Component
        movable_comp::register(&mut world, ctx);
        obstruction_comp::register(&mut world, ctx);
        encounterable_comp::register(&mut world, ctx);
        encountertrigger_comp::register(&mut world, ctx);
        player_comp::register(&mut world, ctx);
        encounter_comp::register(&mut world, ctx);
        ownedmonsters_comp::register(&mut world, ctx);
        monster_comp::register(&mut world, ctx);
        position_comp::register(&mut world, ctx);
        randomseed_comp::register(&mut world, ctx);
        map_comp::register(&mut world, ctx);

        transfer::public_share_object(world);
    }

    #[test_only]
    public fun init_world_for_testing(ctx: &mut TxContext){
        init(ctx)
    }
}
