module constantinople::init {
    use std::ascii::string;
    use sui::transfer;
    use sui::tx_context::TxContext;
    use constantinople::world;
	use constantinople::datauser_schema;
	use constantinople::movable_schema;
	use constantinople::monster_schema;
	use constantinople::obstruction_schema;
	use constantinople::player_schema;
	use constantinople::owned_monsters_schema;
	use constantinople::position_schema;
	use constantinople::encounter_schema;
	use constantinople::encounter_trigger_schema;
	use constantinople::encounterable_schema;
	use constantinople::random_seed_schema;
	use constantinople::map_schema;

    fun init(ctx: &mut TxContext) {
        let _obelisk_world = world::create(string(b"Constantinople"), string(b"Constantinople"),ctx);

        // Add Schema
		datauser_schema::register(&mut _obelisk_world, ctx);
		movable_schema::register(&mut _obelisk_world, ctx);
		monster_schema::register(&mut _obelisk_world, ctx);
		obstruction_schema::register(&mut _obelisk_world, ctx);
		player_schema::register(&mut _obelisk_world, ctx);
		owned_monsters_schema::register(&mut _obelisk_world, ctx);
		position_schema::register(&mut _obelisk_world, ctx);
		encounter_schema::register(&mut _obelisk_world, ctx);
		encounter_trigger_schema::register(&mut _obelisk_world, ctx);
		encounterable_schema::register(&mut _obelisk_world, ctx);
		random_seed_schema::register(&mut _obelisk_world, ctx);
		map_schema::register(&mut _obelisk_world, ctx);

        transfer::public_share_object(_obelisk_world);
    }

    #[test_only]
    public fun init_world_for_testing(ctx: &mut TxContext){
        init(ctx)
    }
}
