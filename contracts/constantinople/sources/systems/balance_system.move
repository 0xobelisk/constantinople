module constantinople::balance_system;
use constantinople::schema::Schema;
use constantinople::errors::{
    balance_too_low_error
};


public(package) fun add_balance(schema: &mut Schema, player: address, amount: u256) {
    let mut maybe_balance = schema.balance().try_get(player);
    if (maybe_balance.is_some()) {
        let balance = maybe_balance.extract();
        schema.balance().set(player, balance + amount);
    } else {
        schema.balance().set(player, amount);
    }
}

public(package) fun sub_balance(schema: &mut Schema, player: address, amount: u256) {
    let mut maybe_balance = schema.balance().try_get(player);
    if (maybe_balance.is_some()) {
        let balance = maybe_balance.extract();
        balance_too_low_error(balance < amount);
        schema.balance().set(player, balance - amount);
    } else {
        balance_too_low_error(false);
    }
}