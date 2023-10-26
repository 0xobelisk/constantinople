module constantinople::encounter_system {
    use sui::tx_context::TxContext;
    use constantinople::world::World;
    use sui::tx_context;
    use std::vector;
    use constantinople::catch_result_schema;
    use constantinople::encounter_schema;
    use constantinople::owned_monsters_schema;
    use sui::clock::Clock;
    use sui::clock;

    const Caught: u8 = 0;
    const Fled: u8 = 1;
    const Missed: u8 = 2;

    /// error not in encounter
    const ENotInEcounter: u64 = 0;

    public entry fun throw_ball(world: &mut World, clock: &Clock, ctx: &mut TxContext) {
        let player = tx_context::sender(ctx);
        // error not in encounter
        assert!(encounter_schema::contains(world, player), ENotInEcounter);

        let (_, monster, catch_attempts) = encounter_schema::get(world, player);
        // Pass in the time as a random number
        let rand = clock::timestamp_ms(clock);
        if (rand % 2 == 0) {
            // 50% chance to catch monster
            if(owned_monsters_schema::contains(world, player)) {
                let owned_monsters = owned_monsters_schema::get(world, player);
                vector::push_back(&mut owned_monsters, monster);
                owned_monsters_schema::set(world, player, owned_monsters);
            } else {
                owned_monsters_schema::set(world, player, vector[monster]);
            };
            encounter_schema::remove(world, player);
            catch_result_schema::emit_catch_result(Caught);
        } else if (catch_attempts >= 2) {
            // Missed 2 times, monster escapes
            encounter_schema::remove(world, player);
            catch_result_schema::emit_catch_result(Fled);
        } else {
            // Throw missed!
            encounter_schema::set_catch_attempts(world, player, catch_attempts + 1);
            catch_result_schema::emit_catch_result(Missed);
        }
    }

    public fun flee(world: &mut World, ctx: &mut TxContext) {
        let player = tx_context::sender(ctx);

        // error not in encounter
        assert!(encounter_schema::contains(world, player), ENotInEcounter);

        encounter_schema::remove(world, player);
    }
}
