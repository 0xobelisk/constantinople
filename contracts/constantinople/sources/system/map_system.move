module constantinople::map_system {
    use constantinople::map_schema;
    use constantinople::world::World;
    use std::vector;
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
    use sui::address;
    use constantinople::monster_schema;
    use constantinople::random_seed_schema;
    use sui::bcs;
    use sui::hash::keccak256;

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
    /// error not in encounter
    const ENotInEcounter: u64 = 5;
    /// error can only move to adjacent spaces
    const EOnlyMoveToAdjacentSpaces: u64 = 6;

    public entry fun init_map(world: &mut World) {
        let (width, height, terrain) = map_schema::get(world);

        let y = 0;
        while (y < height) {
            let x = 0;
            while (x < width) {
                let value = *vector::borrow(vector::borrow(&terrain, y), x);
                let entity = entity_key::from_position(x, y);
                if (value == 20) {
                    encounter_trigger_schema::set(world, entity, true);
                };
                if (value >= 40) {
                    obstruction_schema::set(world, entity, true);
                };
                x = x + 1;
            };
            y = y + 1;
        };
    }

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

    public entry fun move_t(world: &mut World, x: u64, y: u64, ctx: &mut TxContext) {
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
            let (random, monster) = random(world, player, position);
            if (random % 3 == 0) {
                start_encounter(world, player, monster);
            };
        };
    }

    fun start_encounter(world: &mut World, player: address, monster: address) {
        let monster_type = bytes_to_u64(address::to_bytes(monster)) % 3;
        monster_schema::set(world, monster, monster_type);
        encounter_schema::set(world, player, true, monster, 0);
    }

    fun distance(from_x: u64, from_y: u64, to_x: u64, to_y: u64) : u64 {
        let delta_x = if(from_x > to_x) {from_x - to_x } else { to_x - from_x };
        let delta_y = if(from_y > to_y) { from_y - to_y } else { to_y - from_y };
        delta_x + delta_y
    }

    public fun random(world: &mut World, player: address, position: address): (u64, address) {
        let random_seed = random_seed_schema::get(world);
        random_seed_schema::set(world, random_seed+1);
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
}
