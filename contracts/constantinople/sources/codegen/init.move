module constantinople::init {
    use std::ascii::string;
    use sui::transfer;
    use sui::tx_context::TxContext;
    use constantinople::world;
    use constantinople::movable_comp;
    use constantinople::monster_comp;
    use constantinople::obstruction_comp;
    use constantinople::player_comp;
    use constantinople::owned_monsters_comp;
    use constantinople::catch_result_comp;
    use constantinople::position_comp;
    use constantinople::encounter_comp;
    use constantinople::encounter_trigger_comp;
    use constantinople::encounterable_comp;
    use constantinople::random_seed_comp;
    use constantinople::map_comp;

    fun init(ctx: &mut TxContext) {
        let _obelisk_world = world::create(string(b"Constantinople"), string(b"Constantinople"),ctx);

        // Add Component
        movable_comp::register(&mut _obelisk_world, ctx);
        monster_comp::register(&mut _obelisk_world, ctx);
        obstruction_comp::register(&mut _obelisk_world, ctx);
        player_comp::register(&mut _obelisk_world, ctx);
        owned_monsters_comp::register(&mut _obelisk_world, ctx);
        catch_result_comp::register(&mut _obelisk_world, ctx);
        position_comp::register(&mut _obelisk_world, ctx);
        encounter_comp::register(&mut _obelisk_world, ctx);
        encounter_trigger_comp::register(&mut _obelisk_world, ctx);
        encounterable_comp::register(&mut _obelisk_world, ctx);
        random_seed_comp::register(&mut _obelisk_world, ctx);
        map_comp::register(&mut _obelisk_world, ctx);

        transfer::public_share_object(_obelisk_world);
    }

    #[test_only]
    public fun init_world_for_testing(ctx: &mut TxContext){
        init(ctx)
    }
}
