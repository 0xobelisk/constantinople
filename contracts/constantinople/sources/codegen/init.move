module constantinople::init {
    use std::ascii::string;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use constantinople::world;
	use constantinople::movable_schema;
	use constantinople::obstruction_schema;
	use constantinople::player_schema;
	use constantinople::owned_monsters_schema;
	use constantinople::position_schema;
	use constantinople::encounter_schema;
	use constantinople::encounter_trigger_schema;
	use constantinople::encounterable_schema;
	use constantinople::map_schema;

    fun init(ctx: &mut TxContext) {
        let (_obelisk_world, admin_cap) = world::create(string(b"Constantinople"), string(b"Constantinople"),ctx);

        // Add Schema
		movable_schema::register(&mut _obelisk_world, &admin_cap, ctx);
		obstruction_schema::register(&mut _obelisk_world, &admin_cap, ctx);
		player_schema::register(&mut _obelisk_world, &admin_cap, ctx);
		owned_monsters_schema::register(&mut _obelisk_world, &admin_cap, ctx);
		position_schema::register(&mut _obelisk_world, &admin_cap, ctx);
		encounter_schema::register(&mut _obelisk_world, &admin_cap, ctx);
		encounter_trigger_schema::register(&mut _obelisk_world, &admin_cap, ctx);
		encounterable_schema::register(&mut _obelisk_world, &admin_cap, ctx);
		map_schema::register(&mut _obelisk_world, &admin_cap, ctx);

        transfer::public_share_object(_obelisk_world);
        transfer::public_transfer(admin_cap, tx_context::sender(ctx));
    }

    #[test_only]
    public fun init_world_for_testing(ctx: &mut TxContext){
        init(ctx)
    }
}
