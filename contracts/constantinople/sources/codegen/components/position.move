module constantinople::position_comp {
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

	const NAME: vector<u8> = b"position";

	public fun id(): address {
		entity_key::from_bytes(NAME)
	}

	// x
	// y
	struct PositionData has copy , drop, store {
		x: u64,
		y: u64
	}

	public fun new(x: u64, y: u64): PositionData {
		PositionData {
			x, 
			y
		}
	}


	struct CompMetadata has store {
		name: String,
		data: Table<address, PositionData>
	}

	public fun register(_obelisk_world: &mut World, ctx: &mut TxContext) {
		world::add_comp<CompMetadata>(_obelisk_world, NAME, CompMetadata {
			name: string(NAME),
			data: table::new<address, PositionData>(ctx)
		});
	}

	public(friend) fun set(_obelisk_world: &mut World, _obelisk_entity_key: address, x: u64, y: u64) {
		let _obelisk_component = world::get_mut_comp<CompMetadata>(_obelisk_world, id());
		let _obelisk_data = new(x, y);
		if(table::contains<address, PositionData>(&_obelisk_component.data, _obelisk_entity_key)) {
			*table::borrow_mut<address, PositionData>(&mut _obelisk_component.data, _obelisk_entity_key) = _obelisk_data;
		} else {
			table::add(&mut _obelisk_component.data, _obelisk_entity_key, _obelisk_data);
		};
		events::emit_set(string(NAME), _obelisk_entity_key, _obelisk_data)
	}

	public(friend) fun set_x(_obelisk_world: &mut World, _obelisk_entity_key: address, x: u64) {
		let _obelisk_component = world::get_mut_comp<CompMetadata>(_obelisk_world, id());
		assert!(table::contains<address, PositionData>(&_obelisk_component.data, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow_mut<address, PositionData>(&mut _obelisk_component.data, _obelisk_entity_key);
		_obelisk_data.x = x;
		events::emit_set(string(NAME), _obelisk_entity_key, *_obelisk_data)
	}

	public(friend) fun set_y(_obelisk_world: &mut World, _obelisk_entity_key: address, y: u64) {
		let _obelisk_component = world::get_mut_comp<CompMetadata>(_obelisk_world, id());
		assert!(table::contains<address, PositionData>(&_obelisk_component.data, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow_mut<address, PositionData>(&mut _obelisk_component.data, _obelisk_entity_key);
		_obelisk_data.y = y;
		events::emit_set(string(NAME), _obelisk_entity_key, *_obelisk_data)
	}


	public fun get(_obelisk_world: &World ,_obelisk_entity_key: address): (u64,u64) {
  		let _obelisk_component = world::get_comp<CompMetadata>(_obelisk_world, id());
  		assert!(table::contains<address, PositionData>(&_obelisk_component.data, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow<address, PositionData>(&_obelisk_component.data, _obelisk_entity_key);
		(
			_obelisk_data.x,
			_obelisk_data.y
		)
	}


	public fun get_x(_obelisk_world: &World, _obelisk_entity_key: address): u64 {
		let _obelisk_component = world::get_comp<CompMetadata>(_obelisk_world, id());
		assert!(table::contains<address, PositionData>(&_obelisk_component.data, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow<address, PositionData>(&_obelisk_component.data, _obelisk_entity_key);
		_obelisk_data.x
	}

	public fun get_y(_obelisk_world: &World, _obelisk_entity_key: address): u64 {
		let _obelisk_component = world::get_comp<CompMetadata>(_obelisk_world, id());
		assert!(table::contains<address, PositionData>(&_obelisk_component.data, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow<address, PositionData>(&_obelisk_component.data, _obelisk_entity_key);
		_obelisk_data.y
	}


	public(friend) fun remove(_obelisk_world: &mut World, _obelisk_entity_key: address) {
		let _obelisk_component = world::get_mut_comp<CompMetadata>(_obelisk_world, id());
		assert!(table::contains<address, PositionData>(&_obelisk_component.data, _obelisk_entity_key), EEntityDoesNotExist);
		table::remove(&mut _obelisk_component.data, _obelisk_entity_key);
		events::emit_remove(string(NAME), _obelisk_entity_key)
	}

	public fun contains(_obelisk_world: &World, _obelisk_entity_key: address): bool {
		let _obelisk_component = world::get_comp<CompMetadata>(_obelisk_world, id());
		table::contains<address, PositionData>(&_obelisk_component.data, _obelisk_entity_key)
	}

}
