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

    // fun distance(from_x: u64, from_y: u64, to_x: u64, to_y: u64) : u64 {
    //     let delta_x = if(from_x > to_x) {from_x - to_x } else { to_x - from_x };
    //     let delta_y = if(from_y > to_y) { from_y - to_y } else { to_y - from_y };
    //     delta_x + delta_y
    // }

    public entry fun up(world: &mut World, ctx: &mut TxContext) {
        let player = tx_context::sender(ctx);
        // error cannot move
        assert!(movable_comp::get(world, player), 0);

        let from_y = position_comp::get_y(world, player);
        position_comp::update_y(world, player, from_y + 1);
    }

    public entry fun down(world: &mut World, ctx: &mut TxContext) {
        let player = tx_context::sender(ctx);
        // error cannot move
        assert!(movable_comp::get(world, player), 0);

        let from_y = position_comp::get_y(world, player);
        position_comp::update_y(world, player, from_y - 1);
    }

    public entry fun left(world: &mut World, ctx: &mut TxContext) {
        let player = tx_context::sender(ctx);
        // error cannot move
        assert!(movable_comp::get(world, player), 0);

        let from_x = position_comp::get_x(world, player);
        position_comp::update_x(world, player, from_x - 1);
    }

    public entry fun right(world: &mut World, ctx: &mut TxContext) {
        let player = tx_context::sender(ctx);
        // error cannot move
        assert!(movable_comp::get(world, player), 0);

        let from_x = position_comp::get_x(world, player);
        position_comp::update_x(world, player, from_x + 1);
    }
}
