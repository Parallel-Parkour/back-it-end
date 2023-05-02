# Back-It-End: The Driveway Rental App

## Vision

The purpose of Back-It-End is to provide a simple, secure and convenient way to match drivers needing limited-term parking with real property owners who have excess driveway space to let out.  Back-It-End provides convenient and economical alternatives to searching for legal parking spots in one of the most congested metro areas in the US.  This application creates value to both renters and owners by providing much more granular parking options to commuters while providing a secondary one-off income stream for homeowners.  Lastly, the project is also environmentally friendly, reducing the time that commuters are idling in traffic.

## Scope

### In

- Display available driveway spots for rental users.

- Allows a renter to book an available parking spot.

- Notify owners when renters have both booked and checked out.

- Sends an invoice to the renter on behalf of the owner.


### Out

- The app is legally agnostic.  It will not do any sort of validation with local ordinances to ensure renters and owners have legal powers to rent.

- The app is not intended to have real-time, one-bus-away style functionality.

- Does not and will never server parking infractions directly to users.

#### Minimum Viable Product

- Back-It-End will allow owner users to advertise the number of spots they have open, match them with renters seeking spots, and provide an invoice to both parties after the renter has vacated the owner's spot.

##### Stretch Goals

- TBD

### Functional Requirements

- Owner users can create spots to notify renter users of availability.

- Renter users can view all open spots.

- Renter users can select an open spot and reserve it from the owner.

- Renter users can notify the owner user that they have vacated the spot.

- Both renter and owner users will receive an invoice after vacating the spot.

#### Data Flow Diagram

![UML](./assets/drivewayUML.png)

![Schema](./assets/schema.png)

##### Non-Functional Requirements

- Spots will be occupied for only one hour duration, subject to change following proof of life / MVP.

