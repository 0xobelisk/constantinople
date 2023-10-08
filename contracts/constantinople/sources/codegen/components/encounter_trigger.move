module constantinople::encounter_trigger_comp {
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

	const NAME: vector<u8> = b"encounter_trigger";

	public fun id(): address {
		entity_key::from_bytes(NAME)
	}

	// value
	struct EncounterTriggerData has copy , drop, store {
		value: bool
	}

	public fun new(value: bool): EncounterTriggerData {
		EncounterTriggerData {
			value
		}
	}


	struct CompMetadata has store {
		name: String,
		data: Table<address, EncounterTriggerData>
	}

	public fun register(_obelisk_world: &mut World, ctx: &mut TxContext) {
		world::add_comp<CompMetadata>(_obelisk_world, NAME, CompMetadata {
			name: string(NAME),
			data: table::new<address, EncounterTriggerData>(ctx)
		});
	}

	public(friend) fun set(_obelisk_world: &mut World, _obelisk_entity_key: address, value: bool) {
		let _obelisk_component = world::get_mut_comp<CompMetadata>(_obelisk_world, id());
		let _obelisk_data = new(value);
		if(table::contains<address, EncounterTriggerData>(&_obelisk_component.data, _obelisk_entity_key)) {
			*table::borrow_mut<address, EncounterTriggerData>(&mut _obelisk_component.data, _obelisk_entity_key) = _obelisk_data;
		} else {
			table::add(&mut _obelisk_component.data, _obelisk_entity_key, _obelisk_data);
		};
		events::emit_set(string(NAME), _obelisk_entity_key, _obelisk_data)
	}



	public fun get(_obelisk_world: &World ,_obelisk_entity_key: address): bool {
  		let _obelisk_component = world::get_comp<CompMetadata>(_obelisk_world, id());
  		assert!(table::contains<address, EncounterTriggerData>(&_obelisk_component.data, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow<address, EncounterTriggerData>(&_obelisk_component.data, _obelisk_entity_key);
		(
			_obelisk_data.value
		)
	}



	public(friend) fun remove(_obelisk_world: &mut World, _obelisk_entity_key: address) {
		let _obelisk_component = world::get_mut_comp<CompMetadata>(_obelisk_world, id());
		assert!(table::contains<address, EncounterTriggerData>(&_obelisk_component.data, _obelisk_entity_key), EEntityDoesNotExist);
		table::remove(&mut _obelisk_component.data, _obelisk_entity_key);
		events::emit_remove(string(NAME), _obelisk_entity_key)
	}

	public fun contains(_obelisk_world: &World, _obelisk_entity_key: address): bool {
		let _obelisk_component = world::get_comp<CompMetadata>(_obelisk_world, id());
		table::contains<address, EncounterTriggerData>(&_obelisk_component.data, _obelisk_entity_key)
	}

}
