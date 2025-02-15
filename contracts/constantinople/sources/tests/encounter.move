#[test_only]
module constantinople::encounter_test {
    use sui::random::Random;
    use sui::random;
    use sui::test_scenario;
    use constantinople::map_system;
    use constantinople::encounter_system;
    use constantinople::init_test;
    use constantinople::schema::Schema;

    #[test]
    public fun throw_ball(){
        let (mut scenario, dapp) = init_test::deploy_dapp_for_testing(@0x0);
        {
            random::create_for_testing(scenario.ctx());
            scenario.next_tx(@0xA);
        };

        let mut schema = test_scenario::take_shared<Schema>(&scenario);
        let random = test_scenario::take_shared<Random>(&scenario);

        let ctx = test_scenario::ctx(&mut scenario);
        map_system::register(&mut schema, 8, 3, ctx);
        map_system::move_position(&mut schema, &random, 3, ctx);
        map_system::move_position(&mut schema, &random, 3, ctx);

        // Cannot move during an encounter
        let encounter_info = schema.encounter()[ctx.sender()];
        assert!(schema.encounter().get(ctx.sender()).get_catch_attempts() == 0);
        encounter_system::throw_ball(&mut schema, &random, ctx);
        assert!(schema.encounter().get(ctx.sender()).get_catch_attempts() == 1);
        encounter_system::throw_ball(&mut schema, &random, ctx);
        assert!(schema.encounter().get(ctx.sender()).get_catch_attempts() == 2);
        encounter_system::throw_ball(&mut schema, &random, ctx);

        assert!(schema.encounter().contains(ctx.sender()) == false);
        assert!(schema.monster().contains(encounter_info.get_monster()) == false);

        map_system::move_position(&mut schema, &random, 3, ctx);
        map_system::move_position(&mut schema, &random, 3, ctx);

        encounter_system::throw_ball(&mut schema, &random, ctx);
        let expect_monster_address = @0x0;
        let expect_monster_type = constantinople::monster_type::new_eagle();
        assert!(schema.monster().get(expect_monster_address) == expect_monster_type);
        assert!(schema.owned_by().get(expect_monster_address) == ctx.sender());
        assert!(schema.encounter().contains(ctx.sender()) == false);

        test_scenario::return_shared(random);
        test_scenario::return_shared(schema);

        dapp.distroy_dapp_for_testing();
        scenario.end();
    }

    #[test]
    public fun flee(){
        let (mut scenario, dapp) = init_test::deploy_dapp_for_testing(@0x0);
        {
            random::create_for_testing(scenario.ctx());
            scenario.next_tx(@0xA);
        };

        let mut schema = test_scenario::take_shared<Schema>(&scenario);
        let random = test_scenario::take_shared<Random>(&scenario);

        let ctx = test_scenario::ctx(&mut scenario);
        map_system::register(&mut schema, 8, 3, ctx);
        map_system::move_position(&mut schema, &random, 3, ctx);
        map_system::move_position(&mut schema, &random, 3, ctx);

        let encounter_info = schema.encounter()[ctx.sender()];
        // Cannot move during an encounter
        encounter_system::flee(&mut schema, ctx);

        assert!(schema.encounter().contains(ctx.sender()) == false);
        assert!(schema.monster().contains(encounter_info.get_monster()) == false);

        test_scenario::return_shared(random);
        test_scenario::return_shared(schema);
        dapp.distroy_dapp_for_testing();
        scenario.end();
    }
}