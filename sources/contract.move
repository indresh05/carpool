module contract_addr::carpooling {
    use std::signer;
    use aptos_std::table::{Self, Table};
    use std::vector;
    
    // Error codes
    const ERR_RIDE_NOT_FOUND: u64 = 1;
    const ERR_INVALID_SEATS: u64 = 2;
    const ERR_RIDE_FULL: u64 = 3;
    const ERR_UNAUTHORIZED: u64 = 4;
    
    struct Ride has store {
        driver: address,
        from_location: vector<u8>,
        to_location: vector<u8>,
        departure_time: u64,
        available_seats: u64,
        price_per_seat: u64,
        riders: vector<address>,
        status: u8, // 0: Open, 1: In Progress, 2: Completed
    }
    
    struct CarpoolState has key {
        rides: Table<u64, Ride>,
        ride_counter: u64,
    }
    
    // Changed this to public entry
    public entry fun initialize(account: &signer) {
        let state = CarpoolState {
            rides: table::new(),
            ride_counter: 0,
        };
        move_to(account, state);
    }
    
    public entry fun create_ride(
        account: &signer,
        from_location: vector<u8>,
        to_location: vector<u8>,
        departure_time: u64,
        available_seats: u64,
        price_per_seat: u64
    ) acquires CarpoolState {
        assert!(available_seats > 0, ERR_INVALID_SEATS);
        let signer_address = signer::address_of(account);
        let state = borrow_global_mut<CarpoolState>(signer_address);
        
        let ride = Ride {
            driver: signer_address,
            from_location,
            to_location,
            departure_time,
            available_seats,
            price_per_seat,
            riders: vector::empty(),
            status: 0,
        };
        
        table::add(&mut state.rides, state.ride_counter, ride);
        state.ride_counter = state.ride_counter + 1;
    }
    
    public entry fun book_ride(
        account: &signer,
        ride_id: u64
    ) acquires CarpoolState {
        let signer_address = signer::address_of(account);
        let state = borrow_global_mut<CarpoolState>(signer_address);
        assert!(table::contains(&state.rides, ride_id), ERR_RIDE_NOT_FOUND);
        
        let ride = table::borrow_mut(&mut state.rides, ride_id);
        assert!(ride.available_seats > 0, ERR_RIDE_FULL);
        assert!(ride.status == 0, ERR_RIDE_NOT_FOUND); // Only allow booking for open rides
        
        vector::push_back(&mut ride.riders, signer_address);
        ride.available_seats = ride.available_seats - 1;
    }
    
    public entry fun complete_ride(
        account: &signer,
        ride_id: u64
    ) acquires CarpoolState {
        let signer_address = signer::address_of(account);
        let state = borrow_global_mut<CarpoolState>(signer_address);
        assert!(table::contains(&state.rides, ride_id), ERR_RIDE_NOT_FOUND);
        
        let ride = table::borrow_mut(&mut state.rides, ride_id);
        assert!(ride.driver == signer_address, ERR_UNAUTHORIZED);
        
        ride.status = 2; // Set to completed
    }
}