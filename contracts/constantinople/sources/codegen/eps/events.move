module constantinople::events {
     use std::ascii::String;
    use sui::event;

    struct SchemaRemoveField has copy, drop {
        _obelisk_schema_name: String,
        _obelisk_entity_key: address
    }

    struct SchemaSetField<T: copy + drop + store> has copy, drop {
        _obelisk_schema_name: String,
        _obelisk_entity_key: address,
        data: T
    }
    
    struct SchemaSetEphemeralRecord<T: copy + drop + store> has copy, drop {
        _obelisk_schema_name: String,
        data: T
    }

    public fun emit_set<T: copy + drop + store>(_obelisk_schema_name: String, _obelisk_entity_key: address, data: T) {
        event::emit(SchemaSetField { _obelisk_schema_name, _obelisk_entity_key, data})
    }
    
    public fun emit_ephemeral<T: copy + drop + store>(_obelisk_schema_name: String, data: T) {
        event::emit(SchemaSetEphemeralRecord { _obelisk_schema_name, data })
    }

    public fun emit_remove(_obelisk_schema_name: String, _obelisk_entity_key: address) {
        event::emit(SchemaRemoveField { _obelisk_schema_name, _obelisk_entity_key })
    }
}
