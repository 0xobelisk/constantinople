module constantinople::map_schema {
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

	const NAME: vector<u8> = b"map";

	public fun id(): address {
		entity_key::from_bytes(NAME)
	}

	// width
	// height
	// terrain
	struct MapData has copy , drop, store {
		width: u64,
		height: u64,
		terrain: vector<vector<u8>>
	}

	public fun new(width: u64, height: u64, terrain: vector<vector<u8>>): MapData {
		MapData {
			width, 
			height, 
			terrain
		}
	}

	struct SchemaMetadata has store {
		name: String,
		data: Table<address, MapData>
	}

	public fun register(_obelisk_world: &mut World, ctx: &mut TxContext) {
		let _obelisk_schema = SchemaMetadata {
			name: string(NAME),
			data: table::new<address, MapData>(ctx)
		};
		table::add(&mut _obelisk_schema.data, id(), new(32, 27, vector[vector[0,0,0,0,0,0,80,80,80,80,80,80,80,0,0,0,0,0,0,0,0,0,0,80,80,80,80,80,80,80,80,80],vector[0,0,0,0,0,0,81,81,81,81,81,81,81,0,0,0,135,136,137,138,139,0,0,81,81,81,81,81,81,81,81,81],vector[0,0,0,0,0,0,22,22,0,20,20,20,20,20,20,0,140,141,142,143,144,0,0,0,0,0,0,0,0,0,80,80],vector[0,0,0,0,0,0,0,0,0,20,20,20,20,20,20,0,145,146,147,148,149,0,0,0,0,83,83,22,0,0,81,81],vector[0,0,0,0,0,0,0,0,0,20,20,22,22,20,20,0,150,151,152,153,154,0,0,0,0,83,83,22,0,0,80,80],vector[0,0,0,0,0,0,0,0,0,20,20,22,22,20,20,0,155,156,157,158,159,161,0,0,0,0,0,0,0,0,81,81],vector[83,83,83,0,0,0,0,0,0,20,20,20,20,20,20,0,0,0,0,23,0,0,0,0,0,0,0,0,0,0,80,80],vector[80,80,83,0,0,0,0,0,0,20,20,20,20,20,20,0,22,0,0,0,0,100,101,102,103,104,105,106,0,0,81,81],vector[81,81,83,0,0,0,0,0,0,0,0,0,0,0,0,0,0,22,0,0,0,107,108,109,110,111,112,113,0,0,80,80],vector[80,80,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,114,115,116,117,118,119,120,0,0,81,81],vector[81,81,22,0,0,0,83,30,31,32,83,0,0,0,70,0,0,0,0,0,0,121,122,123,124,125,126,127,0,0,80,80],vector[80,80,22,0,0,0,83,33,34,35,83,0,0,0,71,0,0,0,0,0,0,128,129,130,131,132,133,134,0,0,81,81],vector[81,81,22,0,0,0,83,33,34,35,83,0,0,22,72,22,0,0,0,80,0,22,22,22,161,23,0,0,0,0,80,80],vector[80,80,22,0,0,0,83,33,34,35,83,0,22,74,73,75,22,0,0,81,0,22,22,22,0,0,0,0,0,0,81,81],vector[81,81,22,0,0,0,83,33,34,35,83,83,20,30,31,32,20,0,0,0,0,0,0,0,0,0,0,0,0,0,83,83],vector[80,80,83,0,0,0,83,33,34,34,31,31,31,34,34,34,31,31,31,31,31,31,31,31,31,31,31,31,31,31,32,83],vector[81,81,83,0,0,0,83,33,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,35,43],vector[83,83,83,0,0,0,83,36,37,37,37,37,37,37,37,37,37,37,37,37,37,34,34,34,37,37,37,37,37,37,38,83],vector[22,83,0,0,0,0,83,83,83,83,83,83,83,83,0,0,0,0,0,0,20,33,34,35,20,0,0,0,0,0,83,83],vector[22,83,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,80,80,20,36,37,38,20,80,0,0,0,0,80,80],vector[22,22,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,81,81,0,60,61,62,0,81,0,0,0,0,81,81],vector[80,80,22,0,20,20,20,0,0,0,0,0,0,0,0,0,0,0,80,80,0,63,64,65,0,80,0,0,22,0,80,80],vector[81,81,22,0,20,20,20,0,0,0,0,0,0,0,0,0,0,0,81,81,0,66,67,68,0,81,0,0,22,0,81,81],vector[80,80,22,0,20,20,20,0,83,83,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,80,80],vector[81,81,22,0,20,20,20,0,83,83,0,0,80,0,80,0,0,0,0,0,22,22,22,22,22,0,0,0,0,0,81,81],vector[80,80,22,0,0,0,0,0,83,83,0,0,81,0,81,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,80,80],vector[81,81,83,83,83,83,83,0,0,0,0,0,0,0,0,0,0,0,0,0,22,22,22,22,22,0,0,0,0,0,81,81]]));
		world::add_schema<SchemaMetadata>(_obelisk_world, NAME, _obelisk_schema);
		events::emit_set(string(NAME), id(), new(32, 27, vector[vector[0,0,0,0,0,0,80,80,80,80,80,80,80,0,0,0,0,0,0,0,0,0,0,80,80,80,80,80,80,80,80,80],vector[0,0,0,0,0,0,81,81,81,81,81,81,81,0,0,0,135,136,137,138,139,0,0,81,81,81,81,81,81,81,81,81],vector[0,0,0,0,0,0,22,22,0,20,20,20,20,20,20,0,140,141,142,143,144,0,0,0,0,0,0,0,0,0,80,80],vector[0,0,0,0,0,0,0,0,0,20,20,20,20,20,20,0,145,146,147,148,149,0,0,0,0,83,83,22,0,0,81,81],vector[0,0,0,0,0,0,0,0,0,20,20,22,22,20,20,0,150,151,152,153,154,0,0,0,0,83,83,22,0,0,80,80],vector[0,0,0,0,0,0,0,0,0,20,20,22,22,20,20,0,155,156,157,158,159,161,0,0,0,0,0,0,0,0,81,81],vector[83,83,83,0,0,0,0,0,0,20,20,20,20,20,20,0,0,0,0,23,0,0,0,0,0,0,0,0,0,0,80,80],vector[80,80,83,0,0,0,0,0,0,20,20,20,20,20,20,0,22,0,0,0,0,100,101,102,103,104,105,106,0,0,81,81],vector[81,81,83,0,0,0,0,0,0,0,0,0,0,0,0,0,0,22,0,0,0,107,108,109,110,111,112,113,0,0,80,80],vector[80,80,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,114,115,116,117,118,119,120,0,0,81,81],vector[81,81,22,0,0,0,83,30,31,32,83,0,0,0,70,0,0,0,0,0,0,121,122,123,124,125,126,127,0,0,80,80],vector[80,80,22,0,0,0,83,33,34,35,83,0,0,0,71,0,0,0,0,0,0,128,129,130,131,132,133,134,0,0,81,81],vector[81,81,22,0,0,0,83,33,34,35,83,0,0,22,72,22,0,0,0,80,0,22,22,22,161,23,0,0,0,0,80,80],vector[80,80,22,0,0,0,83,33,34,35,83,0,22,74,73,75,22,0,0,81,0,22,22,22,0,0,0,0,0,0,81,81],vector[81,81,22,0,0,0,83,33,34,35,83,83,20,30,31,32,20,0,0,0,0,0,0,0,0,0,0,0,0,0,83,83],vector[80,80,83,0,0,0,83,33,34,34,31,31,31,34,34,34,31,31,31,31,31,31,31,31,31,31,31,31,31,31,32,83],vector[81,81,83,0,0,0,83,33,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,35,43],vector[83,83,83,0,0,0,83,36,37,37,37,37,37,37,37,37,37,37,37,37,37,34,34,34,37,37,37,37,37,37,38,83],vector[22,83,0,0,0,0,83,83,83,83,83,83,83,83,0,0,0,0,0,0,20,33,34,35,20,0,0,0,0,0,83,83],vector[22,83,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,80,80,20,36,37,38,20,80,0,0,0,0,80,80],vector[22,22,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,81,81,0,60,61,62,0,81,0,0,0,0,81,81],vector[80,80,22,0,20,20,20,0,0,0,0,0,0,0,0,0,0,0,80,80,0,63,64,65,0,80,0,0,22,0,80,80],vector[81,81,22,0,20,20,20,0,0,0,0,0,0,0,0,0,0,0,81,81,0,66,67,68,0,81,0,0,22,0,81,81],vector[80,80,22,0,20,20,20,0,83,83,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,80,80],vector[81,81,22,0,20,20,20,0,83,83,0,0,80,0,80,0,0,0,0,0,22,22,22,22,22,0,0,0,0,0,81,81],vector[80,80,22,0,0,0,0,0,83,83,0,0,81,0,81,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,80,80],vector[81,81,83,83,83,83,83,0,0,0,0,0,0,0,0,0,0,0,0,0,22,22,22,22,22,0,0,0,0,0,81,81]]));
	}

	public(friend) fun set(_obelisk_world: &mut World,  width: u64, height: u64, terrain: vector<vector<u8>>) {
		let _obelisk_schema = world::get_mut_schema<SchemaMetadata>(_obelisk_world, id());
		let _obelisk_data = new(width, height, terrain);
		if(table::contains<address, MapData>(&_obelisk_schema.data, id())) {
			*table::borrow_mut<address, MapData>(&mut _obelisk_schema.data, id()) = _obelisk_data;
		} else {
			table::add(&mut _obelisk_schema.data, id(), _obelisk_data);
		};
		events::emit_set(string(NAME), id(), _obelisk_data)
	}

	public(friend) fun set_width(_obelisk_world: &mut World,  width: u64) {
		let _obelisk_schema = world::get_mut_schema<SchemaMetadata>(_obelisk_world, id());
		assert!(table::contains<address, MapData>(&_obelisk_schema.data, id()), EEntityDoesNotExist);
		let _obelisk_data = table::borrow_mut<address, MapData>(&mut _obelisk_schema.data, id());
		_obelisk_data.width = width;
		events::emit_set(string(NAME), id(), *_obelisk_data)
	}

	public(friend) fun set_height(_obelisk_world: &mut World,  height: u64) {
		let _obelisk_schema = world::get_mut_schema<SchemaMetadata>(_obelisk_world, id());
		assert!(table::contains<address, MapData>(&_obelisk_schema.data, id()), EEntityDoesNotExist);
		let _obelisk_data = table::borrow_mut<address, MapData>(&mut _obelisk_schema.data, id());
		_obelisk_data.height = height;
		events::emit_set(string(NAME), id(), *_obelisk_data)
	}

	public(friend) fun set_terrain(_obelisk_world: &mut World,  terrain: vector<vector<u8>>) {
		let _obelisk_schema = world::get_mut_schema<SchemaMetadata>(_obelisk_world, id());
		assert!(table::contains<address, MapData>(&_obelisk_schema.data, id()), EEntityDoesNotExist);
		let _obelisk_data = table::borrow_mut<address, MapData>(&mut _obelisk_schema.data, id());
		_obelisk_data.terrain = terrain;
		events::emit_set(string(NAME), id(), *_obelisk_data)
	}

	public fun get(_obelisk_world: &World ,): (u64,u64,vector<vector<u8>>) {
  		let _obelisk_schema = world::get_schema<SchemaMetadata>(_obelisk_world, id());
  		assert!(table::contains<address, MapData>(&_obelisk_schema.data, id()), EEntityDoesNotExist);
		let _obelisk_data = table::borrow<address, MapData>(&_obelisk_schema.data, id());
		(
			_obelisk_data.width,
			_obelisk_data.height,
			_obelisk_data.terrain
		)
	}

	public fun get_width(_obelisk_world: &World, ): u64 {
		let _obelisk_schema = world::get_schema<SchemaMetadata>(_obelisk_world, id());
		assert!(table::contains<address, MapData>(&_obelisk_schema.data, id()), EEntityDoesNotExist);
		let _obelisk_data = table::borrow<address, MapData>(&_obelisk_schema.data, id());
		_obelisk_data.width
	}

	public fun get_height(_obelisk_world: &World, ): u64 {
		let _obelisk_schema = world::get_schema<SchemaMetadata>(_obelisk_world, id());
		assert!(table::contains<address, MapData>(&_obelisk_schema.data, id()), EEntityDoesNotExist);
		let _obelisk_data = table::borrow<address, MapData>(&_obelisk_schema.data, id());
		_obelisk_data.height
	}

	public fun get_terrain(_obelisk_world: &World, ): vector<vector<u8>> {
		let _obelisk_schema = world::get_schema<SchemaMetadata>(_obelisk_world, id());
		assert!(table::contains<address, MapData>(&_obelisk_schema.data, id()), EEntityDoesNotExist);
		let _obelisk_data = table::borrow<address, MapData>(&_obelisk_schema.data, id());
		_obelisk_data.terrain
	}



}
