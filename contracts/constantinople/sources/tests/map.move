#[test_only]
module constantinople::map_test {
    use constantinople::schema::Schema;
    use constantinople::position;
    use sui::random::Random;
    use sui::random;
    use sui::test_scenario;
    use constantinople::map_system;
    use constantinople::init_test;
    use constantinople::encounter_info;
    use constantinople::monster_type;

    #[test]
    fun register(){
       let (mut scenario, dapp) = init_test::deploy_dapp_for_testing(@0xA);
        let mut schema = test_scenario::take_shared<Schema>(&scenario);

        let ctx = test_scenario::ctx(&mut scenario);
        map_system::register(&mut schema, 0, 0, ctx);

        test_scenario::return_shared(schema);
        dapp.distroy_dapp_for_testing();
        scenario.end();
    }

    #[test]
    fun move_position_should_work(){
        let (mut scenario, dapp) = init_test::deploy_dapp_for_testing(@0x0);
        let mut schema = test_scenario::take_shared<Schema>(&scenario);
        {
            random::create_for_testing(scenario.ctx());
            scenario.next_tx(@0xA);
        };
        let random = test_scenario::take_shared<Random>(&scenario);

        let ctx = test_scenario::ctx(&mut scenario);
        map_system::register(&mut schema, 8, 3, ctx);

        map_system::move_position(&mut schema, &random, 1, ctx);
        assert!(schema.position()[ctx.sender()] == position::new(8, 4));
        assert!(schema.balance()[ctx.sender()] == 1);

        map_system::move_position(&mut schema, &random, 1, ctx);
        assert!(schema.position()[ctx.sender()] == position::new(8, 5));
        assert!(schema.balance()[ctx.sender()] == 2);

        // 23140719614837502849299678247283568217
        // 265323129722700274815559996314403104838
        // 167645769845140257622894197850400210971
        // 337352614844298231097611607824428697695
        // 143043683458825263308720013747056599257
        // 97853292883519077516783190366887388411
        // 226059294092153697833364734032968362880

        map_system::move_position(&mut schema, &random, 3, ctx);
        map_system::move_position(&mut schema, &random, 3, ctx);
        assert!(schema.balance()[ctx.sender()] == 2);
        let expect_monster_address = @0x0;
        let expect_monster_type = monster_type::new_rat();
        assert!(schema.monster().get(expect_monster_address) == expect_monster_type);
        assert!(schema.encounter().get(ctx.sender()) == encounter_info::new(expect_monster_address, 0));

        test_scenario::return_shared(schema);
        test_scenario::return_shared(random);
        dapp.distroy_dapp_for_testing();
        scenario.end();
    }
}