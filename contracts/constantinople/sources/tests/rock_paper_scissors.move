#[test_only]
module constantinople::rock_paper_scissors_test {
    use constantinople::rock_paper_scissors_system;
    use sui::random::Random;
    use sui::random;
    use sui::test_scenario;
    use constantinople::init_test;
    use constantinople::schema::Schema;

    #[test]
    public fun start_game(){
        let (mut scenario, dapp) = init_test::deploy_dapp_for_testing(@0x0);
        {
            random::create_for_testing(scenario.ctx());
            scenario.next_tx(@0xA);
        };

        let mut schema = test_scenario::take_shared<Schema>(&scenario);
        let random = test_scenario::take_shared<Random>(&scenario);

        let ctx = test_scenario::ctx(&mut scenario);
        rock_paper_scissors_system::start_game(&mut schema, 1, &random, ctx);

        test_scenario::return_shared(random);
        test_scenario::return_shared(schema);

        dapp.distroy_dapp_for_testing();
        scenario.end();
    }
}