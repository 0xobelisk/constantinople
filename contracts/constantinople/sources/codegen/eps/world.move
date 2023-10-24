module constantinople::world {
    use std::ascii::{String, string};
    use std::vector;
    use sui::tx_context::TxContext;
    use sui::bag::{Self, Bag};
    use sui::object::{Self, UID, ID};
    
    const VERSION: u64 = 1;

    /// Schema does not exist
    const ESchemaDoesNotExist: u64 = 0;
    /// Schema already exists
    const ESchemaAlreadyExists: u64 = 1;
    /// Not the right admin for this world
    const ENotAdmin: u64 = 2;
    /// Migration is not an upgrade
    const ENotUpgrade: u64 = 3;
    /// Calling functions from the wrong package version
    const EWrongVersion: u64 = 4;

    struct AdminCap has key, store {
        id: UID,
    }

    struct World has key, store {
        id: UID,
        /// Name of the world
        name: String,
        /// Description of the world
        description: String,
        /// Schemas of the world
        schemas: Bag,
        /// Schema names of the world
        schema_names: vector<String>,
        /// admin of the world
        admin: ID,
        /// Version of the world
        version: u64
    }

    public fun create(name: String, description: String, ctx: &mut TxContext): (World, AdminCap) {
        let admin_cap = AdminCap {
            id: object::new(ctx),
        };
        let _obelisk_world = World {
            id: object::new(ctx),
            name,
            description,
            schemas: bag::new(ctx),
            schema_names: vector::empty(),
            admin: object::id(&admin_cap),
            version: VERSION
        };
        (_obelisk_world, admin_cap)
    }
    
    public fun get_admin(_obelisk_world: &World): ID {
        _obelisk_world.admin
    }

    public fun info(_obelisk_world: &World): (String, String, u64) {
        (_obelisk_world.name, _obelisk_world.description, _obelisk_world.version)
    }
    
    public fun schema_names(_obelisk_world: &World): vector<String> {
        _obelisk_world.schema_names
    }

    public fun get_schema<T : store>(_obelisk_world: &World, _obelisk_schema_id: vector<u8>): &T {
        assert!(_obelisk_world.version == VERSION, EWrongVersion);
        assert!(bag::contains(&_obelisk_world.schemas, _obelisk_schema_id), ESchemaDoesNotExist);
        bag::borrow<vector<u8>, T>(&_obelisk_world.schemas, _obelisk_schema_id)
    }

    public fun get_mut_schema<T : store>(_obelisk_world: &mut World, _obelisk_schema_id: vector<u8>): &mut T {
        assert!(_obelisk_world.version == VERSION, EWrongVersion);
        assert!(bag::contains(&_obelisk_world.schemas, _obelisk_schema_id), ESchemaDoesNotExist);
        bag::borrow_mut<vector<u8>, T>(&mut _obelisk_world.schemas, _obelisk_schema_id)
    }

    public fun add_schema<T : store>(_obelisk_world: &mut World, _obelisk_schema_id: vector<u8>, schema: T, admin_cap: &AdminCap){
        assert!(_obelisk_world.admin == object::id(admin_cap), ENotAdmin);
        assert!(_obelisk_world.version == VERSION, EWrongVersion);
        assert!(!bag::contains(&_obelisk_world.schemas, _obelisk_schema_id), ESchemaAlreadyExists);
        vector::push_back(&mut _obelisk_world.schema_names, string(_obelisk_schema_id));
        bag::add<vector<u8>,T>(&mut _obelisk_world.schemas, _obelisk_schema_id, schema);
    }

    public fun contains(_obelisk_world: &mut World, _obelisk_schema_id: vector<u8>): bool {
        assert!(_obelisk_world.version == VERSION, EWrongVersion);
        bag::contains(&mut _obelisk_world.schemas, _obelisk_schema_id)
    }
    
    entry fun migrate(_obelisk_world: &mut World, admin_cap: &AdminCap) {
        assert!(_obelisk_world.admin == object::id(admin_cap), ENotAdmin);
        assert!(_obelisk_world.version < VERSION, ENotUpgrade);
        _obelisk_world.version = VERSION;
    }
}
