module constantinople::random_seed_schema {
	use std::option::none;
    use sui::tx_context::TxContext;
    use constantinople::events;
    use constantinople::world::{Self, World, AdminCap};
    // Systems
	friend constantinople::rpg_system;
	friend constantinople::deploy_hook;

	const SCHEMA_ID: vector<u8> = b"random_seed";
	const SCHEMA_TYPE: u8 = 1;

	// value
	struct RandomSeedData has copy, drop , store {
		value: u64
	}

	public fun new(value: u64): RandomSeedData {
		RandomSeedData {
			value
		}
	}

	public fun register(_obelisk_world: &mut World, admin_cap: &AdminCap, _ctx: &mut TxContext) {
		let _obelisk_schema = new(0);
		world::add_schema<RandomSeedData>(_obelisk_world, SCHEMA_ID, _obelisk_schema, admin_cap);
		events::emit_set(SCHEMA_ID, SCHEMA_TYPE, none(), _obelisk_schema);
	}

	public(friend) fun set(_obelisk_world: &mut World,  value: u64) {
		let _obelisk_schema = world::get_mut_schema<RandomSeedData>(_obelisk_world, SCHEMA_ID);
		_obelisk_schema.value = value;
	}

	public fun get(_obelisk_world: &World): u64 {
		let _obelisk_schema = world::get_schema<RandomSeedData>(_obelisk_world, SCHEMA_ID);
		(
			_obelisk_schema.value
		)
	}
}
