# ShopSphere — Full-Stack E-Commerce Demo

ShopSphere is a portfolio learning project with a responsive frontend and a Java REST backend.

## Technology stack
- **Frontend:** HTML5, CSS3, vanilla JavaScript
- **Backend:** Java 17, Spring Boot, Spring Web, Spring Data JPA, Bean Validation
- **Database:** MySQL

## Features
- Responsive storefront, product search, category filters and sorting
- Product catalogue loaded from the backend/MySQL (static demo fallback if backend is offline)
- Shopping cart with quantity controls and browser `localStorage` persistence
- Checkout submits customer/order details to the Spring Boot API
- Server validates order fields and calculates totals from database product prices
- Orders and order items are saved in MySQL

## Run the project
1. Install JDK 17+, MySQL Server and the VS Code Live Server extension (or use IntelliJ for the backend).
2. Follow [`backend/README.md`](backend/README.md) to configure MySQL and start Spring Boot on port 8080.
3. Open the project root in VS Code, right-click `index.html`, and choose **Open with Live Server**.
4. Open `http://localhost:8080/api/products` to check that the backend is running.
5. Add products to the bag and submit the demo checkout. A successful order will be stored in MySQL.

## Project structure
```text
ShopSphere_WebDevelopment/
├── index.html
├── css/style.css
├── js/app.js
├── js/products.js
└── backend/                 # Java Spring Boot + MySQL REST API
    ├── pom.xml
    └── src/main/java/com/shopsphere/backend/
```

## API endpoints
- `GET /api/products` — list products
- `POST /api/orders` — save an order and its line items

## Important limitations
This is a learning/portfolio project, not a production store. It has no real payment gateway, customer login, admin panel or production security. Do not enter real personal/payment information. Keep database credentials private and never commit passwords. Product images are remote Unsplash URLs.

## GitHub upload
Create a repository named `ShopSphere-ECommerce`, then run these commands from the extracted project root:
```bash
git init
git add .
git commit -m "Build full-stack ShopSphere e-commerce demo"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/ShopSphere-ECommerce.git
git push -u origin main
```
Replace `YOUR-USERNAME` with your GitHub username.

## Resume description (after you run and understand it)
**ShopSphere — Full-Stack E-Commerce Demo | HTML, CSS, JavaScript, Java, Spring Boot, MySQL**
- Built a responsive storefront with product search, category filtering, sorting and a persistent shopping cart.
- Developed REST APIs using Spring Boot and Spring Data JPA to retrieve products and save customer orders.
- Integrated MySQL persistence and server-side order validation with totals calculated from database prices.
