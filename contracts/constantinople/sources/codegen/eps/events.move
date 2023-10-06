module constantinople::events {
     use std::option::Option;
    use sui::event;
    use constantinople::entity_key;

    struct CompRegister<T: copy + drop + store> has copy, drop {
        comp: address,
        data: Option<T>
    }

    struct CompRemoveField has copy, drop {
        comp: address,
        key: address
    }

    struct CompSetField<T: copy + drop + store> has copy, drop {
        comp: address,
        key: Option<address>,
        data: T
    }

    public fun emit_register<T: copy + drop + store>(component_name: vector<u8>, data: Option<T>) {
        let comp = entity_key::from_bytes(component_name);
        event::emit(CompRegister { comp,  data})
    }

    public fun emit_set<T: copy + drop + store>(comp: address, key: Option<address>, data: T) {
        event::emit(CompSetField { comp, key, data})
    }

    public fun emit_remove(comp: address, key: address) {
        event::emit(CompRemoveField { comp, key })
    }
}
