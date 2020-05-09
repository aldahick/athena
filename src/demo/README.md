# Structure

This is structured as I like to structure my projects, with:
* services being basic / utility logic that doesn't depend on business needs at all,
* managers being implementations of business logic, and
* resolvers / controllers being security checks and parsing of whatever oddities may occur in the external interface.

Each level should only ever touch a level directly above it (i.e., resolvers & controllers should never touch services, and services should never touch managers or resolvers).

This structure is not required to use Athena, but it is strongly recommended.
