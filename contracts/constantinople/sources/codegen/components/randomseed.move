module constantinople::randomseed_comp {
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

	const NAME: vector<u8> = b"randomseed";

	// value
	struct RandomseedData has copy , drop, store {
		value: u64
	}

	public fun new_data(value: u64): RandomseedData {
		RandomseedData {
			value
		}
	}



	struct CompMetadata has store {
		name: String,
		entity_key_to_index: Table<address, u64>,
		entities: TableVec<address>,
		data: Table<address, RandomseedData>
	}

	public fun new(ctx: &mut TxContext): CompMetadata {
		CompMetadata {
			name: name(),
			entity_key_to_index: table::new<address, u64>(ctx),
			entities: table_vec::empty<address>(ctx),
			data: table::new<address, RandomseedData>(ctx)
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

	public fun data(world: &World): &Table<address, RandomseedData> {
		let _obelisk_component = world::get_comp<CompMetadata>(world, id());
		&_obelisk_component.data
	}

	public fun register(world: &mut World, ctx: &mut TxContext) {
		let _obelisk_component = new(ctx);
		table::add(&mut _obelisk_component.data, id(), new_data(0));
		world::add_comp<CompMetadata>(world, NAME, _obelisk_component);
		events::emit_register(NAME, none<RandomseedData>());
	}

	public(friend) fun update(world: &mut World,  value: u64) {
		let _obelisk_component = world::get_mut_comp<CompMetadata>(world, id());
		*table::borrow_mut<address, RandomseedData>(&mut _obelisk_component.data, id()) = new_data(value);
		events::emit_set(id(), none(), new_data(value))
	}

	public fun get(world: &World ,): u64 {
  		let _obelisk_component = world::get_comp<CompMetadata>(world, id());
		let _obelisk_data = table::borrow<address, RandomseedData>(&_obelisk_component.data, id());
		(
			_obelisk_data.value
		)
}

}
