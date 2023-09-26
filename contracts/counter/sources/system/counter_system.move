module counter::counter_system {
    use counter::world::World;
    use counter::counter_comp;

    public entry fun inc(world: &mut World){
        let value = counter_comp::get(world) + 1;
        counter_comp::update(world,value);
    }
}
