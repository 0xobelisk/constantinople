module constantinople::world {
    use std::ascii::{String, string};
    use std::vector;
    use sui::tx_context;
    use sui::transfer;
    use sui::tx_context::TxContext;
    use sui::bag::{Self, Bag};
    use sui::object::{Self, UID, ID};
    use constantinople::entity_key;

    const VERSION: u64 = 1;

    /// Component does not exist
    const ECompDoesNotExist: u64 = 0;
    /// Component already exists
    const ECompAlreadyExists: u64 = 1;
    /// Not the right admin for this world
    const ENotAdmin: u64 = 2;
    /// Migration is not an upgrade
    const ENotUpgrade: u64 = 3;
    /// Calling functions from the wrong package version
    const EWrongVersion: u64 = 4;

    struct AdminCap has key {
        id: UID,
    }

    struct World has key, store {
        id: UID,
        /// Name of the world
        name: String,
        /// Description of the world
        description: String,
        /// Components of the world
        comps: Bag,
        /// Component names of the world
        compnames: vector<String>,
        /// admin of the world
        admin: ID,
        /// Version of the world
        version: u64
    }

    public fun create(name: String, description: String, ctx: &mut TxContext): World {
        let admin = AdminCap {
            id: object::new(ctx),
        };
        let _obelisk_world = World {
            id: object::new(ctx),
            name,
            description,
            comps: bag::new(ctx),
            compnames: vector::empty(),
            admin: object::id(&admin),
            version: VERSION
        };
        transfer::transfer(admin, tx_context::sender(ctx));
        _obelisk_world
    }

    public fun info(_obelisk_world: &World): (String, String, u64) {
        (_obelisk_world.name, _obelisk_world.description, _obelisk_world.version)
    }
    
    public fun compnames(_obelisk_world: &World): vector<String> {
        _obelisk_world.compnames
    }

    public fun get_comp<T : store>(_obelisk_world: &World, id: address): &T {
        assert!(_obelisk_world.version == VERSION, EWrongVersion);
        assert!(bag::contains(&_obelisk_world.comps, id), ECompDoesNotExist);
        bag::borrow<address, T>(&_obelisk_world.comps, id)
    }

    public fun get_mut_comp<T : store>(_obelisk_world: &mut World, id: address): &mut T {
        assert!(_obelisk_world.version == VERSION, EWrongVersion);
        assert!(bag::contains(&_obelisk_world.comps, id), ECompDoesNotExist);
        bag::borrow_mut<address, T>(&mut _obelisk_world.comps, id)
    }

    public fun add_comp<T : store>(_obelisk_world: &mut World, component_name: vector<u8>, component: T){
        assert!(_obelisk_world.version == VERSION, EWrongVersion);
        let id = entity_key::from_bytes(component_name);
        assert!(!bag::contains(&_obelisk_world.comps, id), ECompAlreadyExists);
        vector::push_back(&mut _obelisk_world.compnames, string(component_name));
        bag::add<address,T>(&mut _obelisk_world.comps, id, component);
    }

    public fun contains(_obelisk_world: &mut World, id: address): bool {
        assert!(_obelisk_world.version == VERSION, EWrongVersion);
        bag::contains(&mut _obelisk_world.comps, id)
    }

    entry fun migrate(_obelisk_world: &mut World, admin_cap: &AdminCap) {
        assert!(_obelisk_world.admin == object::id(admin_cap), ENotAdmin);
        assert!(_obelisk_world.version < VERSION, ENotUpgrade);
        _obelisk_world.version = VERSION;
    }
}
