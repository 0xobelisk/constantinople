module counter::entity_key {
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
}
