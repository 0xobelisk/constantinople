module counter::counter_comp {
    use std::ascii::{String, string};
    use std::option::none;
    use std::vector;
    use sui::bcs;
    use counter::entity_key;
    use counter::world::{Self, World};
  
    // Systems
	friend counter::counter_system;

	const NAME: vector<u8> = b"counter";

	public fun id(): address {
		entity_key::from_bytes(NAME)
	}

	// value
	public fun field_types(): vector<String> {
		vector[string(b"u64")]
	}
  
	struct Field has drop, store {
		data: vector<u8>
	}

	public fun register(world: &mut World) {
		world::add_comp<Field>(
			world,
			NAME,
			Field { data: encode(0) }
		);
	}

	public(friend) fun update(world: &mut World, value: u64) {
		let data = encode(value);
		world::get_mut_comp<Field>(world, id()).data = data;
		world::emit_update_event(id(), none(), data)
	}

	public fun get(world: &World): u64 {
		let data = world::get_comp<Field>(world, id()).data;
		decode(data)
	}

	public fun encode(value: u64): vector<u8> {
		let data = vector::empty<u8>();
		vector::append(&mut data, bcs::to_bytes(&value));
		data
	}

	public fun decode(bytes: vector<u8>): u64 {
		let data = bcs::new(bytes);
		(
			bcs::peel_u64(&mut data)
		)
	}
}
