#[allow(lint(share_owned), unused_let_mut)]module constantinople::deploy_hook {

  use std::ascii::string;

  use sui::clock::Clock;

  use constantinople::dapp_system;

  use constantinople::entity_schema::Entity;

  use constantinople::map_schema::Map;

  use constantinople::encounter_schema::Encounter;
    use constantinople::terrain_type;

  public entry fun run(clock: &Clock, ctx: &mut TxContext) {
    // Create a dapp.
    let mut dapp = dapp_system::create(string(b"constantinople"),string(b"constantinople contract"), clock , ctx);
    // Create schemas
    let mut entity = constantinople::entity_schema::create(ctx);
    let mut map = constantinople::map_schema::create(ctx);
    let mut encounter = constantinople::encounter_schema::create(ctx);
    // Logic that needs to be automated once the contract is deployed
    {
			let  o = terrain_type::new_none();
            let  t = terrain_type::new_tall_grass();
            let  b = terrain_type::new_boulder();
			let terrains = vector[
             vector [t, o, o, o, o, o, t, o, o, o],
             vector [t, t, t, o, o, o, o, o, o, o],
             vector [t, t, t, t, o, o, o, o, b, o],
             vector [o, o, t, t, o, o, o, o, o, o],
             vector [o, b, b, o, o, o, o, o, o, o],
             vector [o, o, o, b, b, o, o, o, o, t],
             vector [t, t, o, o, o, o, o, t, o, b],
             vector [t, o, o, o, o, t, t, t, o, b],
             vector [o, o, o, o, o, t, t, t, o, b],
             vector [o, o, o, b, o, o, t, t, o, b],
            ];

        let height = terrains.length();
        let width = terrains[0].length();
        let x: u64 = 0;
        let y: u64 = 0;

        map.config().set(constantinople::map_config::new(width, height, terrains));

        y.range_do!(height, |y| {
            x.range_do!(width, |x| {
                let terrain = terrains[y][x];
                let entity_key = constantinople::map_system::position_to_address(x, y);
                let position = constantinople::position::new(x, y);
                map.position().set(entity_key, position);
                // std::debug::print(&position);
                // std::debug::print(&terrain);
                if (terrain == terrain_type::new_none()) {
                    entity.obstruction().set(entity_key, false);
                    entity.encounterable().set(entity_key, false);
                    entity.moveable().set(entity_key, false);
                    encounter.trigger().set(entity_key, false);
                } else if (terrain == terrain_type::new_boulder()) {
                    entity.obstruction().set(entity_key, true);
                    entity.encounterable().set(entity_key, false);
                    entity.moveable().set(entity_key, false);
                    encounter.trigger().set(entity_key, false);
                } else if (terrain == terrain_type::new_tall_grass()) {
                    entity.obstruction().set(entity_key, false);
                    entity.encounterable().set(entity_key, false);
                    entity.moveable().set(entity_key, false);
                    encounter.trigger().set(entity_key, true);
                }
            });
        });
			};
    // Authorize schemas and public share objects
    dapp.add_schema<Entity>(entity, ctx);
    dapp.add_schema<Map>(map, ctx);
    dapp.add_schema<Encounter>(encounter, ctx);
    sui::transfer::public_share_object(dapp);
  }
}
