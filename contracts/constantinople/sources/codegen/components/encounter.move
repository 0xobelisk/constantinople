module constantinople::encounter_comp {
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

	const NAME: vector<u8> = b"encounter";

	public fun id(): address {
		entity_key::from_bytes(NAME)
	}

	// exists
	// monster
	// catch_attempts
	struct EncounterData has copy , drop, store {
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


	struct CompMetadata has store {
		name: String,
		data: Table<address, EncounterData>
	}

	public fun register(_obelisk_world: &mut World, ctx: &mut TxContext) {
		world::add_comp<CompMetadata>(_obelisk_world, NAME, CompMetadata {
			name: string(NAME),
			data: table::new<address, EncounterData>(ctx)
		});
	}

	public(friend) fun set(_obelisk_world: &mut World, _obelisk_entity_key: address, exists: bool, monster: address, catch_attempts: u64) {
		let _obelisk_component = world::get_mut_comp<CompMetadata>(_obelisk_world, id());
		let _obelisk_data = new(exists, monster, catch_attempts);
		if(table::contains<address, EncounterData>(&_obelisk_component.data, _obelisk_entity_key)) {
			*table::borrow_mut<address, EncounterData>(&mut _obelisk_component.data, _obelisk_entity_key) = _obelisk_data;
		} else {
			table::add(&mut _obelisk_component.data, _obelisk_entity_key, _obelisk_data);
		};
		events::emit_set(string(NAME), _obelisk_entity_key, _obelisk_data)
	}

	public(friend) fun set_exists(_obelisk_world: &mut World, _obelisk_entity_key: address, exists: bool) {
		let _obelisk_component = world::get_mut_comp<CompMetadata>(_obelisk_world, id());
		assert!(table::contains<address, EncounterData>(&_obelisk_component.data, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow_mut<address, EncounterData>(&mut _obelisk_component.data, _obelisk_entity_key);
		_obelisk_data.exists = exists;
		events::emit_set(string(NAME), _obelisk_entity_key, *_obelisk_data)
	}

	public(friend) fun set_monster(_obelisk_world: &mut World, _obelisk_entity_key: address, monster: address) {
		let _obelisk_component = world::get_mut_comp<CompMetadata>(_obelisk_world, id());
		assert!(table::contains<address, EncounterData>(&_obelisk_component.data, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow_mut<address, EncounterData>(&mut _obelisk_component.data, _obelisk_entity_key);
		_obelisk_data.monster = monster;
		events::emit_set(string(NAME), _obelisk_entity_key, *_obelisk_data)
	}

	public(friend) fun set_catch_attempts(_obelisk_world: &mut World, _obelisk_entity_key: address, catch_attempts: u64) {
		let _obelisk_component = world::get_mut_comp<CompMetadata>(_obelisk_world, id());
		assert!(table::contains<address, EncounterData>(&_obelisk_component.data, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow_mut<address, EncounterData>(&mut _obelisk_component.data, _obelisk_entity_key);
		_obelisk_data.catch_attempts = catch_attempts;
		events::emit_set(string(NAME), _obelisk_entity_key, *_obelisk_data)
	}


	public fun get(_obelisk_world: &World ,_obelisk_entity_key: address): (bool,address,u64) {
  		let _obelisk_component = world::get_comp<CompMetadata>(_obelisk_world, id());
  		assert!(table::contains<address, EncounterData>(&_obelisk_component.data, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow<address, EncounterData>(&_obelisk_component.data, _obelisk_entity_key);
		(
			_obelisk_data.exists,
			_obelisk_data.monster,
			_obelisk_data.catch_attempts
		)
	}


	public fun get_exists(_obelisk_world: &World, _obelisk_entity_key: address): bool {
		let _obelisk_component = world::get_comp<CompMetadata>(_obelisk_world, id());
		assert!(table::contains<address, EncounterData>(&_obelisk_component.data, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow<address, EncounterData>(&_obelisk_component.data, _obelisk_entity_key);
		_obelisk_data.exists
	}

	public fun get_monster(_obelisk_world: &World, _obelisk_entity_key: address): address {
		let _obelisk_component = world::get_comp<CompMetadata>(_obelisk_world, id());
		assert!(table::contains<address, EncounterData>(&_obelisk_component.data, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow<address, EncounterData>(&_obelisk_component.data, _obelisk_entity_key);
		_obelisk_data.monster
	}

	public fun get_catch_attempts(_obelisk_world: &World, _obelisk_entity_key: address): u64 {
		let _obelisk_component = world::get_comp<CompMetadata>(_obelisk_world, id());
		assert!(table::contains<address, EncounterData>(&_obelisk_component.data, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow<address, EncounterData>(&_obelisk_component.data, _obelisk_entity_key);
		_obelisk_data.catch_attempts
	}


	public(friend) fun remove(_obelisk_world: &mut World, _obelisk_entity_key: address) {
		let _obelisk_component = world::get_mut_comp<CompMetadata>(_obelisk_world, id());
		assert!(table::contains<address, EncounterData>(&_obelisk_component.data, _obelisk_entity_key), EEntityDoesNotExist);
		table::remove(&mut _obelisk_component.data, _obelisk_entity_key);
		events::emit_remove(string(NAME), _obelisk_entity_key)
	}

	public fun contains(_obelisk_world: &World, _obelisk_entity_key: address): bool {
		let _obelisk_component = world::get_comp<CompMetadata>(_obelisk_world, id());
		table::contains<address, EncounterData>(&_obelisk_component.data, _obelisk_entity_key)
	}

}
