#[allow(lint(share_owned))]module constantinople::genesis {

  use std::ascii::string;

  use sui::clock::Clock;

  use constantinople::dapp_system;

  public entry fun run(clock: &Clock, ctx: &mut TxContext) {
    // Create a dapp.
    let mut dapp = dapp_system::create(string(b"constantinople"),string(b"constantinople contract"), clock , ctx);
    // Create schemas
    let mut schema = constantinople::schema::create(ctx);
    // Logic that needs to be automated once the contract is deployed
    constantinople::deploy_hook::run(&mut schema, ctx);
    // Authorize schemas and public share objects
    dapp.add_schema(schema);
    sui::transfer::public_share_object(dapp);
  }
}
