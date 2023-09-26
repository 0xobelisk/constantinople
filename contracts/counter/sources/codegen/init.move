module counter::init {
    use std::ascii::string;
    use sui::transfer;
    use sui::tx_context::TxContext;
    use counter::world;

	use counter::counter_comp;

    fun init(ctx: &mut TxContext) {
        let world = world::create(string(b"Counter"), string(b"Examples counter"),ctx);

        // Add Component

		counter_comp::register(&mut world);

        transfer::public_share_object(world);
    }

    #[test_only]
    public fun init_world_for_testing(ctx: &mut TxContext){
        init(ctx)
    }
}
