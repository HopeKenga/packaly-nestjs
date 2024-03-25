## Order Creation Flow in NestJS Application

### Overview
This document outlines the flow and setup for an order creation feature in a NestJS application, highlighting key validation steps and the integration of Prisma for database management.

### Validation and Processing Flow

1. **Order Validation Pipe**: The process begins with the `OrderValidationPipe`, which validates incoming data against predefined rules.
   - **Data Interception**: Validates and processes the data, ensuring compliance with our requirements, including:
     - **Package Validation**: Checks that package information is present.
     - **Address Handling**: Validates both shipping and billing addresses.
     - **Zipcode Validation**: Ensures the zipcode is exactly 6 characters long.

2. **DTO Validation**: Utilizes the `OrderDTO` to further validate the data structure, ensuring it meets the order format requirements.

3. **Class Validator Integration**: Incorporates a class validator for robust data validation within interceptor pipes.

4. **Data Processing and Order Creation**: Involves destructuring the data, calculating the total amount, and assigning a default order status. Also includes:
   - **Volume-based Pricing**: Adjusts pricing based on the volume of each package.

5. **Data Saving**: Prioritizes order saving to maintain relational data integrity and optimizes address handling by using a single model for both pickup and dropoff addresses.

### Prisma Integration

Prisma is chosen for its strong typing system, support for multiple databases, and ease of migration. Prisma ensures that database operations are efficient and scalable.

### Testing

Tests focus on critical functionalities like price calculation and status updating, ensuring the application meets its specifications.

## Setup Instructions

### Prerequisites

- Install the Nest CLI.
- Ensure MongoDB is running and connected.
- Choose either Yarn or npm as your package manager.

### Installation Steps

1. **Clone the Repository**: Obtain the project code by cloning the repository.

2. **Install Dependencies**:
   - Using Yarn: `yarn install`
   - Using npm: `npm install`

3. **Install and Setup Prisma**:
   - Add Prisma: 
     - Yarn: `yarn add prisma`
     - npm: `npm install prisma`
   - Generate Prisma client:
     - Yarn: `yarn prisma generate`
     - npm: `npx prisma generate`
   - Apply database migrations:
     - Yarn: `yarn prisma migrate dev`
     - npm: `npx prisma migrate dev`
   - Open Prisma Studio to view the database:
     - Yarn: `yarn prisma studio`
     - npm: `npx prisma studio`


### Testing Endpoints

To test the application's endpoints, you can use the provided Postman collection. This allows you to quickly interact with the API, testing its functionality and response to various requests.

- **Postman Collection**: Access and import the collection using the following link: [Postman Collection](https://api.postman.com/collections/10865182-7d9c935c-b12a-4709-9fb2-6c0b25916d63?access_key=PMAT-01HSV5DRRH21QZ9PE1NT94TT5J).
  - After importing, ensure you set the base URL to `http://localhost:3333/api/` to match your local development environment.
  - Adjust the environment settings as needed to correspond with your local or staging environments for comprehensive testing.


### API Documentation

- Access detailed API documentation by visiting `http://localhost:3333/api/docs` once the application is successfully running.
