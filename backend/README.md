# ShopSphere Backend (Java + Spring Boot + MySQL)

REST API for the ShopSphere e-commerce portfolio project.

## Requirements
- JDK 17 or newer
- MySQL Server / MySQL Workbench
- Maven (or open this folder in IntelliJ IDEA and let it import `pom.xml`)

## Configure MySQL
1. Start MySQL Server.
2. Create the database (or let the URL create it automatically if your MySQL account has permission):
   ```sql
   CREATE DATABASE shopsphere;
   ```
3. The default username is `root` and the default password is blank. If your MySQL setup uses another password, set environment variables before running:
   - PowerShell: `$env:DB_USERNAME="root"; $env:DB_PASSWORD="your_mysql_password"`
   - Do not commit real passwords to GitHub.

## Run the backend
From this `backend` directory:

```bash
mvn spring-boot:run
```

Or open `backend` in IntelliJ IDEA, wait for Maven import, and run `ShopSphereApplication.java`.
The API starts at `http://localhost:8080` and inserts the eight demo products the first time the database is empty.

## API endpoints
- `GET http://localhost:8080/api/products` — reads products from MySQL.
- `POST http://localhost:8080/api/orders` — validates and stores an order and its line items; the server calculates the total from database prices.

Example order body:
```json
{
  "customerName": "Demo Customer",
  "customerEmail": "demo@example.com",
  "deliveryAddress": "12 Demo Street, Mathura, 281001",
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 3, "quantity": 1 }
  ]
}
```

## Important
This is a learning/portfolio backend. It does not include user login, payment processing, inventory management, or production security. Checkout is a demo order only; do not enter real personal information. The frontend must be run with VS Code Live Server (recommended) while the API is running.
