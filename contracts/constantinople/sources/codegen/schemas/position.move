module constantinople::position_schema {
	use std::option::some;
    use sui::tx_context::TxContext;
    use sui::table::{Self, Table};
    use constantinople::events;
    use constantinople::world::{Self, World, AdminCap};

    // Systems
	friend constantinople::map_system;
	friend constantinople::encounter_system;
	friend constantinople::deploy_hook;

	/// Entity does not exist
	const EEntityDoesNotExist: u64 = 0;

	const SCHEMA_ID: vector<u8> = b"position";
	const SCHEMA_TYPE: u8 = 0;

	// x
	// y
	struct PositionData has copy, drop , store {
		x: u64,
		y: u64
	}

	public fun new(x: u64, y: u64): PositionData {
		PositionData {
			x, 
			y
		}
	}

	public fun register(_obelisk_world: &mut World, admin_cap: &AdminCap, ctx: &mut TxContext) {
		world::add_schema<Table<address,PositionData>>(_obelisk_world, SCHEMA_ID, table::new<address, PositionData>(ctx), admin_cap);
	}

	public(friend) fun set(_obelisk_world: &mut World, _obelisk_entity_key: address,  x: u64, y: u64) {
		let _obelisk_schema = world::get_mut_schema<Table<address,PositionData>>(_obelisk_world, SCHEMA_ID);
		let _obelisk_data = new( x, y);
		if(table::contains<address, PositionData>(_obelisk_schema, _obelisk_entity_key)) {
			*table::borrow_mut<address, PositionData>(_obelisk_schema, _obelisk_entity_key) = _obelisk_data;
		} else {
			table::add(_obelisk_schema, _obelisk_entity_key, _obelisk_data);
		};
		events::emit_set(SCHEMA_ID, SCHEMA_TYPE, some(_obelisk_entity_key), _obelisk_data)
	}

	public(friend) fun set_x(_obelisk_world: &mut World, _obelisk_entity_key: address, x: u64) {
		let _obelisk_schema = world::get_mut_schema<Table<address,PositionData>>(_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, PositionData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow_mut<address, PositionData>(_obelisk_schema, _obelisk_entity_key);
		_obelisk_data.x = x;
		events::emit_set(SCHEMA_ID, SCHEMA_TYPE, some(_obelisk_entity_key), *_obelisk_data)
	}

	public(friend) fun set_y(_obelisk_world: &mut World, _obelisk_entity_key: address, y: u64) {
		let _obelisk_schema = world::get_mut_schema<Table<address,PositionData>>(_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, PositionData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow_mut<address, PositionData>(_obelisk_schema, _obelisk_entity_key);
		_obelisk_data.y = y;
		events::emit_set(SCHEMA_ID, SCHEMA_TYPE, some(_obelisk_entity_key), *_obelisk_data)
	}

	public fun get(_obelisk_world: &World, _obelisk_entity_key: address): (u64,u64) {
		let _obelisk_schema = world::get_schema<Table<address,PositionData>>(_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, PositionData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow<address, PositionData>(_obelisk_schema, _obelisk_entity_key);
		(
			_obelisk_data.x,
			_obelisk_data.y
		)
	}

	public fun get_x(_obelisk_world: &World, _obelisk_entity_key: address): u64 {
		let _obelisk_schema = world::get_schema<Table<address,PositionData>>(_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, PositionData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow<address, PositionData>(_obelisk_schema, _obelisk_entity_key);
		_obelisk_data.x
	}

	public fun get_y(_obelisk_world: &World, _obelisk_entity_key: address): u64 {
		let _obelisk_schema = world::get_schema<Table<address,PositionData>>(_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, PositionData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow<address, PositionData>(_obelisk_schema, _obelisk_entity_key);
		_obelisk_data.y
	}

	public(friend) fun remove(_obelisk_world: &mut World, _obelisk_entity_key: address) {
		let _obelisk_schema = world::get_mut_schema<Table<address,PositionData>>(_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, PositionData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		table::remove(_obelisk_schema, _obelisk_entity_key);
		events::emit_remove(SCHEMA_ID, _obelisk_entity_key)
	}

	public fun contains(_obelisk_world: &World, _obelisk_entity_key: address): bool {
		let _obelisk_schema = world::get_schema<Table<address,PositionData>>(_obelisk_world, SCHEMA_ID);
		table::contains<address, PositionData>(_obelisk_schema, _obelisk_entity_key)
	}
}
