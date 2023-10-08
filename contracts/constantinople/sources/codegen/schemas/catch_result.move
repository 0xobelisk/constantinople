module constantinople::catch_result_schema {
    use sui::table::{Self, Table};
    use std::ascii::{String, string};
    use sui::tx_context::TxContext;
    use constantinople::events;
    use constantinople::world::{Self, World};
    
    const NAME: vector<u8> = b"catch_result";
    
	// value
	struct CatchResultData has copy , drop, store {
		value: u8
	}
  
	struct SchemaMetadata has store {
		name: String,
		data: Table<address, CatchResultData>
	}

	public fun register(_obelisk_world: &mut World, ctx: &mut TxContext) {
		world::add_schema<SchemaMetadata>(_obelisk_world, NAME, SchemaMetadata {
			name: string(NAME),
			data: table::new<address, CatchResultData>(ctx)
		});
	}

	public fun emit_catch_result(value: u8) {
		events::emit_ephemeral(string(NAME), CatchResultData { value })
	}
}