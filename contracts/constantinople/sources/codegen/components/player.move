module constantinople::player_comp {
    use std::ascii::{String, string};
    use std::option::some;
    use std::vector;
    use sui::bcs;
    use sui::tx_context::TxContext;
    use sui::table::{Self, Table};
    use sui::table_vec::{Self, TableVec};
    use constantinople::entity_key;
    use constantinople::world::{Self, World};
  
    // Systems
	friend constantinople::move_system;

	const NAME: vector<u8> = b"player";

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
		_obelisk_component
	}

	public fun id(): address {
		entity_key::from_bytes(NAME)
	}

	public fun name(): String {
		string(NAME)
	}

	public fun types(): vector<String> {
		vector[string(b"bool")]
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

	public(friend) fun add(world: &mut World, key: address, value: bool) {
		let _obelisk_component = world::get_mut_comp<CompMetadata>(world, id());
		let _obelisk_data = encode(value);
		table::add(&mut _obelisk_component.entity_key_to_index, key, table_vec::length(&_obelisk_component.entities));
		table_vec::push_back(&mut _obelisk_component.entities, key);
		table::add(&mut _obelisk_component.data, key, _obelisk_data);
		world::emit_add_event(id(), key, _obelisk_data)
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
		world::emit_remove_event(id(), key)
	}

	public(friend) fun update(world: &mut World, key: address, value: bool) {
		let _obelisk_component = world::get_mut_comp<CompMetadata>(world, id());
		let _obelisk_data = encode(value);
		*table::borrow_mut<address, vector<u8>>(&mut _obelisk_component.data, key) = _obelisk_data;
		world::emit_update_event(id(), some(key), _obelisk_data)
	}

	public fun get(world: &World, key: address): bool {
		let _obelisk_component = world::get_comp<CompMetadata>(world, id());
		let _obelisk_data = table::borrow<address, vector<u8>>(&_obelisk_component.data, key);
		decode(*_obelisk_data)
	}

	public fun contains(world: &World, key: address): bool {
		let _obelisk_component = world::get_comp<CompMetadata>(world, id());
		table::contains<address, vector<u8>>(&_obelisk_component.data, key)
	}

	public fun encode(value: bool): vector<u8> {
		let _obelisk_data = vector::empty<u8>();
		vector::append(&mut _obelisk_data, bcs::to_bytes(&value));
		_obelisk_data
	}

	public fun decode(bytes: vector<u8>): bool {
		let _obelisk_data = bcs::new(bytes);
		(
			bcs::peel_bool(&mut _obelisk_data)
		)
	}
}
