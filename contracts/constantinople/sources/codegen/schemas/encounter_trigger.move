module constantinople::encounter_trigger_schema {
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

	const SCHEMA_ID: vector<u8> = b"encounter_trigger";
	const SCHEMA_TYPE: u8 = 0;

	// value
	struct EncounterTriggerData has copy, drop , store {
		value: bool
	}

	public fun new(value: bool): EncounterTriggerData {
		EncounterTriggerData {
			value
		}
	}

	public fun register(_obelisk_world: &mut World, admin_cap: &AdminCap, ctx: &mut TxContext) {
		world::add_schema<Table<address,EncounterTriggerData>>(_obelisk_world, SCHEMA_ID, table::new<address, EncounterTriggerData>(ctx), admin_cap);
	}

	public(friend) fun set(_obelisk_world: &mut World, _obelisk_entity_key: address,  value: bool) {
		let _obelisk_schema = world::get_mut_schema<Table<address,EncounterTriggerData>>(_obelisk_world, SCHEMA_ID);
		let _obelisk_data = new( value);
		if(table::contains<address, EncounterTriggerData>(_obelisk_schema, _obelisk_entity_key)) {
			*table::borrow_mut<address, EncounterTriggerData>(_obelisk_schema, _obelisk_entity_key) = _obelisk_data;
		} else {
			table::add(_obelisk_schema, _obelisk_entity_key, _obelisk_data);
		};
		events::emit_set(SCHEMA_ID, SCHEMA_TYPE, some(_obelisk_entity_key), _obelisk_data)
	}

	public fun get(_obelisk_world: &World, _obelisk_entity_key: address): bool {
		let _obelisk_schema = world::get_schema<Table<address,EncounterTriggerData>>(_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, EncounterTriggerData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		let _obelisk_data = table::borrow<address, EncounterTriggerData>(_obelisk_schema, _obelisk_entity_key);
		(
			_obelisk_data.value
		)
	}

	public(friend) fun remove(_obelisk_world: &mut World, _obelisk_entity_key: address) {
		let _obelisk_schema = world::get_mut_schema<Table<address,EncounterTriggerData>>(_obelisk_world, SCHEMA_ID);
		assert!(table::contains<address, EncounterTriggerData>(_obelisk_schema, _obelisk_entity_key), EEntityDoesNotExist);
		table::remove(_obelisk_schema, _obelisk_entity_key);
		events::emit_remove(SCHEMA_ID, _obelisk_entity_key)
	}

	public fun contains(_obelisk_world: &World, _obelisk_entity_key: address): bool {
		let _obelisk_schema = world::get_schema<Table<address,EncounterTriggerData>>(_obelisk_world, SCHEMA_ID);
		table::contains<address, EncounterTriggerData>(_obelisk_schema, _obelisk_entity_key)
	}
}
