# Carpooling DApp on Aptos Blockchain

This project is a decentralized carpooling application built on the Aptos blockchain using the Move language. The system allows users to create carpool rides, book seats, and complete rides in a decentralized and secure environment. The backend logic is written in Move, and it is designed to integrate with a frontend that interacts with the Aptos blockchain.

## Features

- *Create a Ride:* Drivers can create a new ride by specifying the departure location, destination, departure time, number of available seats, and price per seat.
- *Book a Ride:* Users can browse available rides and book seats by signing a transaction. The available seats will be decremented automatically.
- *Complete a Ride:* Once the ride is completed, the driver can mark it as completed. Only the driver can perform this action.
- *Ride Management:* The application manages the status of each ride (Open, In Progress, Completed) and ensures that only available rides can be booked.

## Module Overview

The main functionality of the carpooling system is defined in the carpooling module. Below are key components and their functions:

### Key Structures

1. *Ride*
   - Represents a carpool ride with the following fields:
     - driver: The address of the driver.
     - from_location: The starting point of the ride (encoded as a vector of bytes).
     - to_location: The destination of the ride (encoded as a vector of bytes).
     - departure_time: The time the ride is scheduled to depart (timestamp).
     - available_seats: The number of available seats for booking.
     - price_per_seat: The price for a single seat on the ride.
     - riders: A list of addresses that have booked a seat on the ride.
     - status: The status of the ride (0 for Open, 1 for In Progress, 2 for Completed).

2. *CarpoolState*
   - Stores the state of the carpooling system, including:
     - rides: A table that maps ride IDs to Ride objects.
     - ride_counter: A counter that keeps track of the next available ride ID.

### Functions

1. *initialize(account: &signer)*
   - Initializes the carpooling system for a given account. This function creates a new CarpoolState and moves it to the provided account.

2. *create_ride(account: &signer, from_location: vector<u8>, to_location: vector<u8>, departure_time: u64, available_seats: u64, price_per_seat: u64)*
   - Allows a user (driver) to create a new carpool ride. The ride details are saved to the rides table, and the ride ID is incremented. This function ensures that the number of available seats is greater than zero.

3. *book_ride(account: &signer, ride_id: u64)*
   - Allows a user to book a seat on an existing ride. The function checks that the ride exists, is open (status 0), and has available seats. If the booking is successful, the user's address is added to the riders list, and the available seats are decremented.

4. *complete_ride(account: &signer, ride_id: u64)*
   - Allows the driver to mark the ride as completed. The function checks that the caller is the driver of the ride and updates the ride's status to "Completed" (status 2).

### Error Codes

- ERR_RIDE_NOT_FOUND: Indicates that the specified ride was not found.
- ERR_INVALID_SEATS: Indicates that the number of available seats provided is invalid (less than or equal to 0).
- ERR_RIDE_FULL: Indicates that there are no available seats for the ride.
- ERR_UNAUTHORIZED: Indicates that the caller is not authorized to complete the ride (e.g., not the driver).

## Address

The module is deployed on the Aptos blockchain, and the carpooling system is initialized for the following address:

*0x82cc89e747697f4a8d44d7e32cb5ad0e0c784d0dddefff16cf74fcff7462c6a6*

This address is responsible for initializing the carpooling state and interacting with the module's functions.

## Setup and Usage

### 1. Initialize the Carpooling State

To initialize the carpooling state for a new user, use the initialize function. This can be done using the Aptos CLI or a frontend application connected to the Aptos blockchain.

### 2. Create a Ride

A driver can create a ride using the create_ride function by providing the following details:
- Departure location
- Destination
- Departure time
- Available seats
- Price per seat

### 3. Book a Ride

Users can browse available rides and book a seat by calling the book_ride function. The user must have a valid Aptos wallet and sign the transaction to complete the booking.

### 4. Complete a Ride

Once the ride is completed, the driver can mark it as completed using the complete_ride function. Only the driver has the authority to do so.

## Frontend Integration

To interact with this module via a frontend, you can use the Aptos JavaScript SDK. The frontend should allow users to:
- Authenticate with their Aptos wallet.
- Create rides.
- Browse and book available rides.
- Mark rides as completed.

The frontend can be developed using modern web technologies such as React or Next.js, and it should connect to the Aptos blockchain to invoke the Move functions described above.

## Conclusion

This decentralized carpooling system provides a secure and transparent way to manage rides and bookings using the power of blockchain. By leveraging Aptos and Move, the application ensures immutability, security, and transparency for all users involved in the carpooling process.