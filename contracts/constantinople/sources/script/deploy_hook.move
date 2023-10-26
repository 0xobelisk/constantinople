module constantinople::deploy_hook {
    use constantinople::world::{World, AdminCap, get_admin};
    use sui::object;
    use constantinople::map_schema;
    use std::vector;
    use constantinople::entity_key;
    use constantinople::encounter_trigger_schema;
    use constantinople::obstruction_schema;
    use constantinople::position_schema;

    /// Not the right admin for this world
    const ENotAdmin: u64 = 0;

    public entry fun run(world: &mut World, admin_cap: &AdminCap) {
        assert!( get_admin(world) == object::id(admin_cap), ENotAdmin);
        
        // Logic that needs to be automated once the contract is deployed
        let (width, height, terrain) = map_schema::get(world);

        let y = 0;
        while (y < height) {
            let x = 0;
            while (x < width) {
                let value = *vector::borrow(vector::borrow(&terrain, y), x);
                let entity = entity_key::from_position(x, y);
                if (value == 20) {
                    position_schema::set(world, entity, x, y);
                    encounter_trigger_schema::set(world, entity, true);
                };
                if (value >= 40) {
                    position_schema::set(world, entity, x, y);
                    obstruction_schema::set(world, entity, true);
                };
                x = x + 1;
            };
            y = y + 1;
        };
    }

    #[test_only]
    public fun deploy_hook_for_testing(world: &mut World, admin_cap: &AdminCap){
        run(world, admin_cap)
    }
}
