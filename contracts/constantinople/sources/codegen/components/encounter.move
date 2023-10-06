module constantinople::encounter_comp {
    use std::ascii::{String, string};
    use std::option::{some, none};
    use sui::tx_context::TxContext;
    use sui::table::{Self, Table};
    use sui::table_vec::{Self, TableVec};
    use constantinople::entity_key;
    use constantinople::events;
    use constantinople::world::{Self, World};
  
    // Systems
	friend constantinople::rpg_system;

	const NAME: vector<u8> = b"encounter";

	// exists
	// monster
	// catchAttempts
	struct EncounterData has copy , drop, store {
		exists: bool,
		monster: address,
		catchAttempts: u64
	}

	public fun new_data(exists: bool, monster: address, catchAttempts: u64): EncounterData {
		EncounterData {
			exists, 
			monster, 
			catchAttempts
		}
	}


	struct CompMetadata has store {
		name: String,
		entity_key_to_index: Table<address, u64>,
		entities: TableVec<address>,
		data: Table<address, EncounterData>
	}

	public fun new(ctx: &mut TxContext): CompMetadata {
		CompMetadata {
			name: name(),
			entity_key_to_index: table::new<address, u64>(ctx),
			entities: table_vec::empty<address>(ctx),
			data: table::new<address, EncounterData>(ctx)
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

	public fun data(world: &World): &Table<address, EncounterData> {
		let _obelisk_component = world::get_comp<CompMetadata>(world, id());
		&_obelisk_component.data
	}

	public fun register(world: &mut World, ctx: &mut TxContext) {
		world::add_comp<CompMetadata>(world, NAME, new(ctx));
		events::emit_register(NAME, none<EncounterData>());
	}

	public(friend) fun add(world: &mut World, key: address, exists: bool, monster: address, catchAttempts: u64) {
		let _obelisk_component = world::get_mut_comp<CompMetadata>(world, id());
		table::add(&mut _obelisk_component.entity_key_to_index, key, table_vec::length(&_obelisk_component.entities));
		table_vec::push_back(&mut _obelisk_component.entities, key);
		table::add(&mut _obelisk_component.data, key, new_data(exists, monster, catchAttempts));
events::emit_set(id(), some(key), new_data(exists, monster, catchAttempts))
	}

	public(friend) fun remove(world: &mut World, key: address) {
		let _obelisk_component = world::get_mut_comp<CompMetadata>(world, id());
		let index = table::remove(&mut _obelisk_component.entity_key_to_index, key);
		if(index == table_vec::length(&_obelisk_component.entities) - 1) {
			table_vec::pop_back(&mut _obelisk_component.entities);
		} else {
			let last_value = table_vec::pop_back(&mut _obelisk_component.entities);
			*table_vec::borrow_mut(&mut _obelisk_component.entities, index) = last_value;
		};
		table::remove(&mut _obelisk_component.data, key);
		events::emit_remove(id(), key)
	}

	public(friend) fun update(world: &mut World, key: address, exists: bool, monster: address, catchAttempts: u64) {
		let _obelisk_component = world::get_mut_comp<CompMetadata>(world, id());
		*table::borrow_mut<address, EncounterData>(&mut _obelisk_component.data, key) = new_data(exists, monster, catchAttempts);
		events::emit_set(id(), some(key), new_data(exists, monster, catchAttempts))
	}
	public(friend) fun update_exists(world: &mut World, key: address, exists: bool) {
		let _obelisk_component = world::get_mut_comp<CompMetadata>(world, id());
		let _obelisk_data = table::borrow_mut<address, EncounterData>(&mut _obelisk_component.data, key);
		_obelisk_data.exists = exists;
		events::emit_set(id(), some(key), *_obelisk_data)
	}

	public(friend) fun update_monster(world: &mut World, key: address, monster: address) {
		let _obelisk_component = world::get_mut_comp<CompMetadata>(world, id());
		let _obelisk_data = table::borrow_mut<address, EncounterData>(&mut _obelisk_component.data, key);
		_obelisk_data.monster = monster;
		events::emit_set(id(), some(key), *_obelisk_data)
	}

	public(friend) fun update_catchAttempts(world: &mut World, key: address, catchAttempts: u64) {
		let _obelisk_component = world::get_mut_comp<CompMetadata>(world, id());
		let _obelisk_data = table::borrow_mut<address, EncounterData>(&mut _obelisk_component.data, key);
		_obelisk_data.catchAttempts = catchAttempts;
		events::emit_set(id(), some(key), *_obelisk_data)
	}

	public fun get(world: &World ,key: address): (bool,address,u64) {
  		let _obelisk_component = world::get_comp<CompMetadata>(world, id());
		let _obelisk_data = table::borrow<address, EncounterData>(&_obelisk_component.data, key);
		(
			_obelisk_data.exists,
			_obelisk_data.monster,
			_obelisk_data.catchAttempts
		)
}

	public fun get_exists(world: &World, key: address): bool {
		let _obelisk_component = world::get_comp<CompMetadata>(world, id());
		let _obelisk_data = table::borrow<address, EncounterData>(&_obelisk_component.data, key);
		_obelisk_data.exists
	}

	public fun get_monster(world: &World, key: address): address {
		let _obelisk_component = world::get_comp<CompMetadata>(world, id());
		let _obelisk_data = table::borrow<address, EncounterData>(&_obelisk_component.data, key);
		_obelisk_data.monster
	}

	public fun get_catchAttempts(world: &World, key: address): u64 {
		let _obelisk_component = world::get_comp<CompMetadata>(world, id());
		let _obelisk_data = table::borrow<address, EncounterData>(&_obelisk_component.data, key);
		_obelisk_data.catchAttempts
	}

	public fun contains(world: &World, key: address): bool {
		let _obelisk_component = world::get_comp<CompMetadata>(world, id());
		table::contains<address, EncounterData>(&_obelisk_component.data, key)
	}

}
