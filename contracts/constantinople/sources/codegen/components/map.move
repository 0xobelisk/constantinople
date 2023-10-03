module constantinople::map_comp {
    use std::ascii::{String, string};
    use std::option::none;
    use std::vector;
    use sui::bcs;
    use sui::tx_context::TxContext;
    use sui::table::{Self, Table};
    use sui::table_vec::{Self, TableVec};
    use constantinople::entity_key;
    use constantinople::world::{Self, World};
  
    // Systems
	friend constantinople::move_system;

	const NAME: vector<u8> = b"map";

	// value
	struct CompMetadata has store {
		id: address,
		name: String,
		types: vector<String>,
		entity_key_to_index: Table<address, u64>,
		entities: TableVec<address>,
		data: Table<address, vector<u8>>
	}

	public fun new(ctx: &mut TxContext): CompMetadata {
		let _obelisk_component = CompMetadata {
			id: id(),
			name: name(),
			types: types(),
			entity_key_to_index: table::new<address, u64>(ctx),
			entities: table_vec::empty<address>(ctx),
			data: table::new<address, vector<u8>>(ctx)
		};
		table::add(&mut _obelisk_component.data, id(), encode(vector[vector[0,0,0,0,0,0,80,80,80,80,80,80,80,0,0,0,0,0,0,0,0,0,0,80,80,80,80,80,80,80,80,80],vector[0,0,0,0,0,0,81,81,81,81,81,81,81,0,0,0,135,136,137,138,139,0,0,81,81,81,81,81,81,81,81,81],vector[0,0,0,0,0,0,22,22,0,20,20,20,20,20,20,0,140,141,142,143,144,0,0,0,0,0,0,0,0,0,80,80],vector[0,0,0,0,0,0,0,0,0,20,20,20,20,20,20,0,145,146,147,148,149,0,0,0,0,83,83,22,0,0,81,81],vector[0,0,0,0,0,0,0,0,0,20,20,22,22,20,20,0,150,151,152,153,154,0,0,0,0,83,83,22,0,0,80,80],vector[0,0,0,0,0,0,0,0,0,20,20,22,22,20,20,0,155,156,157,158,159,161,0,0,0,0,0,0,0,0,81,81],vector[83,83,83,0,0,0,0,0,0,20,20,20,20,20,20,0,0,0,0,160,0,0,0,0,0,0,0,0,0,0,80,80],vector[80,80,83,0,0,0,0,0,0,20,20,20,20,20,20,0,22,0,0,0,0,100,101,102,103,104,105,106,0,0,81,81],vector[81,81,83,0,0,0,0,0,0,0,0,0,0,0,0,0,0,22,0,0,0,107,108,109,110,111,112,113,0,0,80,80],vector[80,80,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,114,115,116,117,118,119,120,0,0,81,81],vector[81,81,22,0,0,0,83,50,51,52,83,0,0,0,70,0,0,0,0,0,0,121,122,123,124,125,126,127,0,0,80,80],vector[80,80,22,0,0,0,83,53,54,55,83,0,0,0,71,0,0,0,0,0,0,128,129,130,131,132,133,134,0,0,81,81],vector[81,81,22,0,0,0,83,53,54,55,83,0,0,22,72,22,0,0,0,80,0,22,22,22,161,160,0,0,0,0,80,80],vector[80,80,22,0,0,0,83,53,54,55,83,0,22,74,73,75,22,0,0,81,0,22,22,22,0,0,0,0,0,0,81,81],vector[81,81,22,0,0,0,83,53,54,55,83,83,20,50,51,52,20,0,0,0,0,0,0,0,0,0,0,0,0,0,83,83],vector[80,80,83,0,0,0,83,53,54,54,51,51,51,54,54,54,51,51,51,51,51,51,51,51,51,51,51,51,51,51,52,83],vector[81,81,83,0,0,0,83,53,54,54,54,54,54,54,54,54,54,54,54,54,54,54,54,54,54,54,54,54,54,54,55,43],vector[83,83,83,0,0,0,83,56,57,57,57,57,57,57,57,57,57,57,57,57,57,54,54,54,57,57,57,57,57,57,58,83],vector[22,83,0,0,0,0,83,83,83,83,83,83,83,83,0,0,0,0,0,0,20,53,54,55,20,0,0,0,0,0,83,83],vector[22,83,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,80,80,20,56,57,58,20,80,0,0,0,0,80,80],vector[22,22,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,81,81,0,60,61,62,0,81,0,0,0,0,81,81],vector[80,80,22,0,20,20,20,0,0,0,0,0,0,0,0,0,0,0,80,80,0,63,64,65,0,80,0,0,22,0,80,80],vector[81,81,22,0,20,20,20,0,0,0,0,0,0,0,0,0,0,0,81,81,0,66,67,68,0,81,0,0,22,0,81,81],vector[80,80,22,0,20,20,20,0,83,83,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,80,80],vector[81,81,22,0,20,20,20,0,83,83,0,0,80,0,80,0,0,0,0,0,22,22,22,22,22,0,0,0,0,0,81,81],vector[80,80,22,0,0,0,0,0,83,83,0,0,81,0,81,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,80,80],vector[81,81,83,83,83,83,83,0,0,0,0,0,0,0,0,0,0,0,0,0,22,22,22,22,22,0,0,0,0,0,81,81]]));
		_obelisk_component
	}

	public fun id(): address {
		entity_key::from_bytes(NAME)
	}

	public fun name(): String {
		string(NAME)
	}

	public fun types(): vector<String> {
		vector[string(b"vector<vector<u8>>")]
	}

	public fun entities(world: &World): &TableVec<address> {
		let _obelisk_component = world::get_comp<CompMetadata>(world, id());
		&_obelisk_component.entities
	}

	public fun entity_length(world: &World): u64 {
		let _obelisk_component = world::get_comp<CompMetadata>(world, id());
		table_vec::length(&_obelisk_component.entities)
	}

	public fun data(world: &World): &Table<address, vector<u8>> {
		let _obelisk_component = world::get_comp<CompMetadata>(world, id());
		&_obelisk_component.data
	}

	public fun register(world: &mut World, ctx: &mut TxContext) {
		world::add_comp<CompMetadata>(world, NAME, new(ctx));
		world::emit_register_event(NAME, types());
	}

	public(friend) fun update(world: &mut World, value: vector<vector<u8>>) {
		let _obelisk_component = world::get_mut_comp<CompMetadata>(world, id());
		let _obelisk_data = encode(value);
		*table::borrow_mut<address, vector<u8>>(&mut _obelisk_component.data, id()) = _obelisk_data;
		world::emit_update_event(id(), none(), _obelisk_data)
	}

	public fun get(world: &World): vector<vector<u8>> {
		let _obelisk_component = world::get_comp<CompMetadata>(world, id());
		let _obelisk_data = table::borrow<address, vector<u8>>(&_obelisk_component.data, id());
		decode(*_obelisk_data)
	}

	public fun encode(value: vector<vector<u8>>): vector<u8> {
		let _obelisk_data = vector::empty<u8>();
		vector::append(&mut _obelisk_data, bcs::to_bytes(&value));
		_obelisk_data
	}

	public fun decode(bytes: vector<u8>): vector<vector<u8>> {
		let _obelisk_data = bcs::new(bytes);
		(
			bcs::peel_vec_vec_u8(&mut _obelisk_data)
		)
	}
}
