module constantinople::move_system {
    use constantinople::movable_comp;
    use constantinople::position_comp;
    use constantinople::world::World;
    use constantinople::player_comp;
    use sui::tx_context;
    use sui::tx_context::TxContext;

    public entry fun register(world: &mut World, ctx: &mut TxContext) {
        let player = tx_context::sender(ctx);
        // error already register
        assert!(!player_comp::contains(world, player), 0);

        player_comp::add(world, player, true);
        position_comp::add(world, player, 0, 0);
        movable_comp::add(world, player, true);
    }

    fun distance(from_x: u64, from_y: u64, to_x: u64, to_y: u64) : u64 {
        let delta_x = if(from_x > to_x) {from_x - to_x } else { to_x - from_x };
        let delta_y = if(from_y > to_y) { from_y - to_y } else { to_y - from_y };
        delta_x + delta_y
    }

    public entry fun move_t(world: &mut World, x: u64, y: u64, ctx: &mut TxContext) {
        let player = tx_context::sender(ctx);
        // error cannot move
        assert!(movable_comp::get(world, player), 0);

        let (from_x, from_y) = position_comp::get(world, player);
        // error can only move to adjacent spaces
        assert!(distance(from_x, from_y, x,y) == 1, 0);
        position_comp::update(world, player, x, y);
    }
}
