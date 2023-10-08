module constantinople::random_seed_comp {
    use std::ascii::{String, string};
    use sui::tx_context::TxContext;
    use sui::table::{Self, Table};
    use constantinople::entity_key;
    use constantinople::events;
    use constantinople::world::{Self, World};
  
    // Systems
	friend constantinople::rpg_system;

	/// Entity does not exist
	const EEntityDoesNotExist: u64 = 0;

	const NAME: vector<u8> = b"random_seed";

	public fun id(): address {
		entity_key::from_bytes(NAME)
	}

	// value
	struct RandomSeedData has copy , drop, store {
		value: u64
	}

	public fun new(value: u64): RandomSeedData {
		RandomSeedData {
			value
		}
	}


	struct CompMetadata has store {
		name: String,
		data: Table<address, RandomSeedData>
	}

	public fun register(_obelisk_world: &mut World, ctx: &mut TxContext) {
		let _obelisk_component = CompMetadata {
			name: string(NAME),
			data: table::new<address, RandomSeedData>(ctx)
		};
		table::add(&mut _obelisk_component.data, id(), new(0));
		world::add_comp<CompMetadata>(_obelisk_world, NAME, _obelisk_component);
		events::emit_set(string(NAME), id(), new(0));
	}

	public(friend) fun set(_obelisk_world: &mut World,  value: u64) {
		let _obelisk_component = world::get_mut_comp<CompMetadata>(_obelisk_world, id());
		let _obelisk_data = new(value);
		if(table::contains<address, RandomSeedData>(&_obelisk_component.data, id())) {
			*table::borrow_mut<address, RandomSeedData>(&mut _obelisk_component.data, id()) = _obelisk_data;
		} else {
			table::add(&mut _obelisk_component.data, id(), _obelisk_data);
		};
		events::emit_set(string(NAME), id(), _obelisk_data)
	}



	public fun get(_obelisk_world: &World ,): u64 {
  		let _obelisk_component = world::get_comp<CompMetadata>(_obelisk_world, id());
  		assert!(table::contains<address, RandomSeedData>(&_obelisk_component.data, id()), EEntityDoesNotExist);
		let _obelisk_data = table::borrow<address, RandomSeedData>(&_obelisk_component.data, id());
		(
			_obelisk_data.value
		)
	}





}
