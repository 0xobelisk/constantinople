module constantinople::catch_result_schema {
    use std::option::none;
    use constantinople::events;
    
    const SCHEMA_ID: vector<u8> = b"catch_result";
    
	// value
	struct CatchResultData has copy, drop  {
		value: u8
	}
  
	public fun emit_catch_result( value: u8) {
		events::emit_set(SCHEMA_ID, none(), CatchResultData {  value })
	}
}