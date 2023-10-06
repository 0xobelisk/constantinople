module constantinople::map_comp {
    use std::ascii::{String, string};
    use std::option::none;
    use sui::tx_context::TxContext;
    use sui::table::{Self, Table};
    use sui::table_vec::{Self, TableVec};
    use constantinople::entity_key;
    use constantinople::events;
    use constantinople::world::{Self, World};
  
    // Systems
	friend constantinople::rpg_system;

	const NAME: vector<u8> = b"map";

	// value
	struct MapData has copy , drop, store {
		value: vector<vector<u8>>
	}

	public fun new_data(value: vector<vector<u8>>): MapData {
		MapData {
			value
		}
	}



	struct CompMetadata has store {
		name: String,
		entity_key_to_index: Table<address, u64>,
		entities: TableVec<address>,
		data: Table<address, MapData>
	}

	public fun new(ctx: &mut TxContext): CompMetadata {
		CompMetadata {
			name: name(),
			entity_key_to_index: table::new<address, u64>(ctx),
			entities: table_vec::empty<address>(ctx),
			data: table::new<address, MapData>(ctx)
		}
	}

	public fun id(): address {
		entity_key::from_bytes(NAME)
	}

	public fun name(): String {
		string(NAME)
	}

	public fun entities(world: &World): &TableVec<address> {
		let _obelisk_component = world::get_comp<CompMetadata>(world, id());
		&_obelisk_component.entities
	}

	public fun entity_length(world: &World): u64 {
		let _obelisk_component = world::get_comp<CompMetadata>(world, id());
		table_vec::length(&_obelisk_component.entities)
	}

	public fun data(world: &World): &Table<address, MapData> {
		let _obelisk_component = world::get_comp<CompMetadata>(world, id());
		&_obelisk_component.data
	}

	public fun register(world: &mut World, ctx: &mut TxContext) {
		let _obelisk_component = new(ctx);
		table::add(&mut _obelisk_component.data, id(), new_data(vector[vector[0,0,0,0,0,0,80,80,80,80,80,80,80,0,0,0,0,0,0,0,0,0,0,80,80,80,80,80,80,80,80,80],vector[0,0,0,0,0,0,81,81,81,81,81,81,81,0,0,0,135,136,137,138,139,0,0,81,81,81,81,81,81,81,81,81],vector[0,0,0,0,0,0,22,22,0,20,20,20,20,20,20,0,140,141,142,143,144,0,0,0,0,0,0,0,0,0,80,80],vector[0,0,0,0,0,0,0,0,0,20,20,20,20,20,20,0,145,146,147,148,149,0,0,0,0,83,83,22,0,0,81,81],vector[0,0,0,0,0,0,0,0,0,20,20,22,22,20,20,0,150,151,152,153,154,0,0,0,0,83,83,22,0,0,80,80],vector[0,0,0,0,0,0,0,0,0,20,20,22,22,20,20,0,155,156,157,158,159,161,0,0,0,0,0,0,0,0,81,81],vector[83,83,83,0,0,0,0,0,0,20,20,20,20,20,20,0,0,0,0,23,0,0,0,0,0,0,0,0,0,0,80,80],vector[80,80,83,0,0,0,0,0,0,20,20,20,20,20,20,0,22,0,0,0,0,100,101,102,103,104,105,106,0,0,81,81],vector[81,81,83,0,0,0,0,0,0,0,0,0,0,0,0,0,0,22,0,0,0,107,108,109,110,111,112,113,0,0,80,80],vector[80,80,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,114,115,116,117,118,119,120,0,0,81,81],vector[81,81,22,0,0,0,83,30,31,32,83,0,0,0,70,0,0,0,0,0,0,121,122,123,124,125,126,127,0,0,80,80],vector[80,80,22,0,0,0,83,33,34,35,83,0,0,0,71,0,0,0,0,0,0,128,129,130,131,132,133,134,0,0,81,81],vector[81,81,22,0,0,0,83,33,34,35,83,0,0,22,72,22,0,0,0,80,0,22,22,22,161,23,0,0,0,0,80,80],vector[80,80,22,0,0,0,83,33,34,35,83,0,22,74,73,75,22,0,0,81,0,22,22,22,0,0,0,0,0,0,81,81],vector[81,81,22,0,0,0,83,33,34,35,83,83,20,30,31,32,20,0,0,0,0,0,0,0,0,0,0,0,0,0,83,83],vector[80,80,83,0,0,0,83,33,34,34,31,31,31,34,34,34,31,31,31,31,31,31,31,31,31,31,31,31,31,31,32,83],vector[81,81,83,0,0,0,83,33,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,35,43],vector[83,83,83,0,0,0,83,36,37,37,37,37,37,37,37,37,37,37,37,37,37,34,34,34,37,37,37,37,37,37,38,83],vector[22,83,0,0,0,0,83,83,83,83,83,83,83,83,0,0,0,0,0,0,20,33,34,35,20,0,0,0,0,0,83,83],vector[22,83,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,80,80,20,36,37,38,20,80,0,0,0,0,80,80],vector[22,22,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,81,81,0,60,61,62,0,81,0,0,0,0,81,81],vector[80,80,22,0,20,20,20,0,0,0,0,0,0,0,0,0,0,0,80,80,0,63,64,65,0,80,0,0,22,0,80,80],vector[81,81,22,0,20,20,20,0,0,0,0,0,0,0,0,0,0,0,81,81,0,66,67,68,0,81,0,0,22,0,81,81],vector[80,80,22,0,20,20,20,0,83,83,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,80,80],vector[81,81,22,0,20,20,20,0,83,83,0,0,80,0,80,0,0,0,0,0,22,22,22,22,22,0,0,0,0,0,81,81],vector[80,80,22,0,0,0,0,0,83,83,0,0,81,0,81,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,80,80],vector[81,81,83,83,83,83,83,0,0,0,0,0,0,0,0,0,0,0,0,0,22,22,22,22,22,0,0,0,0,0,81,81],]));
		world::add_comp<CompMetadata>(world, NAME, _obelisk_component);
		events::emit_register(NAME, none<MapData>());
	}

	public(friend) fun update(world: &mut World,  value: vector<vector<u8>>) {
		let _obelisk_component = world::get_mut_comp<CompMetadata>(world, id());
		*table::borrow_mut<address, MapData>(&mut _obelisk_component.data, id()) = new_data(value);
		events::emit_set(id(), none(), new_data(value))
	}

	public fun get(world: &World ,): vector<vector<u8>> {
  		let _obelisk_component = world::get_comp<CompMetadata>(world, id());
		let _obelisk_data = table::borrow<address, MapData>(&_obelisk_component.data, id());
		(
			_obelisk_data.value
		)
}

}
