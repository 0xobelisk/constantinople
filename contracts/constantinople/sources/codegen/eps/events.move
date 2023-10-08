module constantinople::events {
     use std::ascii::String;
    use sui::event;

    struct CompRemoveField has copy, drop {
        _obelisk_comp_name: String,
        _obelisk_entity_key: address
    }

    struct CompSetField<T: copy + drop + store> has copy, drop {
        _obelisk_comp_name: String,
        _obelisk_entity_key: address,
        data: T
    }

    public fun emit_set<T: copy + drop + store>(_obelisk_comp_name: String, _obelisk_entity_key: address, data: T) {
        event::emit(CompSetField { _obelisk_comp_name, _obelisk_entity_key, data})
    }

    public fun emit_remove(_obelisk_comp_name: String, _obelisk_entity_key: address) {
        event::emit(CompRemoveField { _obelisk_comp_name, _obelisk_entity_key })
    }
}
