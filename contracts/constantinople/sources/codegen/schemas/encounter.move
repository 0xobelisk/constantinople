module constantinople::encounter_schema {
	use std::option::some;
    use sui::tx_context::TxContext;
    use sui::table::{Self, Table};
    use constantinople::events;
    use constantinople::world::{Self, World};

    // Systems
	friend constantinople::rpg_system;

	/// Entity does not exist
	const EEntityDoesNotExist: u64 = 0;

	const SCHEMA_ID: vector<u8> = b"encounter";

	// exists
	// monster
	// catch_attempts
	struct EncounterData has copy, drop , store {
		exists: bool,
		monster: address,
		catch_attempts: u64
	}

	public fun new(exists: bool, monster: address, catch_attempts: u64): EncounterData {
		EncounterData {
			exists, 
			monster, 
			catch_attempts
		}
	}

	public fun register(_obelisk_world: &mut World, ctx: &mut TxContext) {
		world::add_schema<Table<address,EncounterData>>(_obelisk_world, SCHEMA_ID, table::new<address, EncounterData>(ctx));
	}

	public(friend) fun set(_obelisk_world: &mut World, _obelisk_entity_key: address,  exists: bool, monster: address, catch_attempts: u64) {
		let _obelisk_schema = world::get_mut_schema<Table<address,EncounterData>>(_obelisk_world, SCHEMA_ID);
		let _obelisk_data = new( exists, monster, catch_attempts);
		if(table::contains<address, EncounterData>(_obelisk_schema, _obelisk_entity_key)) {
			*table::borrow_mut<address, EncounterData>(_obelisk_schema, _obelisk_entity_key) = _obelisk_data;
		} else {
			table::add(_obelisk_schema, _obelisk_entity_key, _obelisk_data);
		};
		events::emit_set(SCHEMA_ID, some(_obelisk_entity_key), _obelisk_data)
	}

	public(friend) fun set_exists(_obelisk_world: &mut World, _obelisk_entity_key: address, exists: bool) {
		let _obelisk_schema = world::get_mut_schema<Table<address,EncounterData>>(_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, EncounterData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow_mut<address, EncounterData>(_obelisk_schema, _obelisk_entity_key);
		_obelisk_data.exists = exists;
		events::emit_set(SCHEMA_ID, some(_obelisk_entity_key), *_obelisk_data)
	}

	public(friend) fun set_monster(_obelisk_world: &mut World, _obelisk_entity_key: address, monster: address) {
		let _obelisk_schema = world::get_mut_schema<Table<address,EncounterData>>(_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, EncounterData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow_mut<address, EncounterData>(_obelisk_schema, _obelisk_entity_key);
		_obelisk_data.monster = monster;
		events::emit_set(SCHEMA_ID, some(_obelisk_entity_key), *_obelisk_data)
	}

	public(friend) fun set_catch_attempts(_obelisk_world: &mut World, _obelisk_entity_key: address, catch_attempts: u64) {
		let _obelisk_schema = world::get_mut_schema<Table<address,EncounterData>>(_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, EncounterData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow_mut<address, EncounterData>(_obelisk_schema, _obelisk_entity_key);
		_obelisk_data.catch_attempts = catch_attempts;
		events::emit_set(SCHEMA_ID, some(_obelisk_entity_key), *_obelisk_data)
	}

	public fun get(_obelisk_world: &World, _obelisk_entity_key: address): (bool,address,u64) {
		let _obelisk_schema = world::get_schema<Table<address,EncounterData>>(_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, EncounterData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow<address, EncounterData>(_obelisk_schema, _obelisk_entity_key);
		(
			_obelisk_data.exists,
			_obelisk_data.monster,
			_obelisk_data.catch_attempts
		)
	}

	public fun get_exists(_obelisk_world: &World, _obelisk_entity_key: address): bool {
		let _obelisk_schema = world::get_schema<Table<address,EncounterData>>(_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, EncounterData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow<address, EncounterData>(_obelisk_schema, _obelisk_entity_key);
		_obelisk_data.exists
	}

	public fun get_monster(_obelisk_world: &World, _obelisk_entity_key: address): address {
		let _obelisk_schema = world::get_schema<Table<address,EncounterData>>(_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, EncounterData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow<address, EncounterData>(_obelisk_schema, _obelisk_entity_key);
		_obelisk_data.monster
	}

	public fun get_catch_attempts(_obelisk_world: &World, _obelisk_entity_key: address): u64 {
		let _obelisk_schema = world::get_schema<Table<address,EncounterData>>(_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, EncounterData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow<address, EncounterData>(_obelisk_schema, _obelisk_entity_key);
		_obelisk_data.catch_attempts
	}

	public(friend) fun remove(_obelisk_world: &mut World, _obelisk_entity_key: address) {
		let _obelisk_schema = world::get_mut_schema<Table<address,EncounterData>>(_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, EncounterData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		table::remove(_obelisk_schema, _obelisk_entity_key);
		events::emit_remove(SCHEMA_ID, _obelisk_entity_key)
	}

	public fun contains(_obelisk_world: &World, _obelisk_entity_key: address): bool {
		let _obelisk_schema = world::get_schema<Table<address,EncounterData>>(_obelisk_world, SCHEMA_ID);
		table::contains<address, EncounterData>(_obelisk_schema, _obelisk_entity_key)
	}
}
