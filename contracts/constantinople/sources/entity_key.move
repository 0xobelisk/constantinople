module constantinople::entity_key {
    use std::vector;
    use sui::bcs;
    use sui::hash::keccak256;
    use sui::address;
    use sui::object;

    public fun from_object<T: key + store>(object: &T): address {
        object::id_address(object)
    }

    public fun from_bytes(bytes: vector<u8>): address {
        address::from_bytes(keccak256(&bytes))
    }

    public fun from_u256(x: u256): address {
        address::from_u256(x)
    }

    public fun from_position(x: u64, y: u64): address {
        let vec = vector::empty<u8>();
        vector::append(&mut vec, bcs::to_bytes(&x));
        vector::append(&mut vec, bcs::to_bytes(&y));
        from_bytes(vec)
    }
}
