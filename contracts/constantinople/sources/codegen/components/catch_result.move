module constantinople::catch_result_comp {
    use sui::event;
    use sui::table::{Self, Table};
    use constantinople::world::{Self, World};
    use std::ascii::{String, string};
    use sui::tx_context::TxContext;
    
    const NAME: vector<u8> = b"catch_result";
    
	// value
	struct CatchResultData has copy , drop, store {
		value: u8
	}

            
	struct CompMetadata has store {
		name: String,
		data: Table<address, CatchResultData>
	}

	public fun register(_obelisk_world: &mut World, ctx: &mut TxContext) {
		world::add_comp<CompMetadata>(_obelisk_world, NAME, CompMetadata {
			name: string(NAME),
			data: table::new<address, CatchResultData>(ctx)
		});
	}

	public fun emit_catch_result(value: u8) {
		event::emit(CatchResultData { value })
	}
}