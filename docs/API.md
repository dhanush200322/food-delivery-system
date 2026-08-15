# API Documentation

The REST API is built using Express and follows standard RESTful conventions.

## Authentication (`/api/auth`)

### `POST /api/auth/login`
- **Auth:** Public
- **Purpose:** Authenticates a user and returns a JWT.
- **Request Body:** `{ "email": "customer@fooddelivery.local", "password": "..." }`
- **Response:** `{ "message": "Logged in successfully", "token": "...", "user": { ... } }`

### `POST /api/auth/register`
- **Auth:** Public
- **Purpose:** Creates a new customer account.
- **Request Body:** `{ "name": "John Doe", "email": "john@example.com", "password": "...", "phone": "1234567890" }`

### `GET /api/auth/me`
- **Auth:** Protected (Requires JWT)
- **Purpose:** Restores a user session on page refresh by returning the current user profile based on the JWT payload.

## Restaurants (`/api/restaurants`)

### `GET /api/restaurants`
- **Auth:** Public
- **Purpose:** Retrieves a list of restaurants. Supports pagination and searching.

### `GET /api/restaurants/:id`
- **Auth:** Public
- **Purpose:** Retrieves detailed information for a specific restaurant, including its active menu items.

## Foods (`/api/foods`)

### `GET /api/foods`
- **Auth:** Public
- **Purpose:** Primary endpoint for discovering food.
- **Query Parameters:**
  - `search`: Full-text search on name/description.
  - `categoryId`: Filter by category.
  - `minPrice` / `maxPrice`: Filter by price range.
  - `restaurantId`: Filter by restaurant.

### `GET /api/foods/:id`
- **Auth:** Public
- **Purpose:** Retrieves details for a specific food item.

## Cart (`/api/cart`)

### `GET /api/cart`
- **Auth:** Protected (Customer)
- **Purpose:** Retrieves the current user's active shopping cart and its items.

### `POST /api/cart/items`
- **Auth:** Protected (Customer)
- **Purpose:** Adds an item to the cart or updates quantity if it already exists.
- **Request Body:** `{ "foodId": "...", "quantity": 1 }`

### `PUT /api/cart/items/:id`
- **Auth:** Protected (Customer)
- **Purpose:** Updates the exact quantity of a cart item.

### `DELETE /api/cart/items/:id`
- **Auth:** Protected (Customer)
- **Purpose:** Removes an item from the cart entirely.

## Checkout & Orders (`/api/orders`)

### `POST /api/orders`
- **Auth:** Protected (Customer)
- **Purpose:** Converts the user's active cart into a confirmed order.
- **Request Body:** `{ "deliveryAddress": "...", "paymentMethod": "CARD" }`
- **Response:** Returns the newly created `Order` object.

### `GET /api/orders`
- **Auth:** Protected (Customer / Admin)
- **Purpose:** 
  - If Customer: Returns only their order history.
  - If Admin: Returns all global orders.

## Favorites (`/api/favorites`)

### `GET /api/favorites`
- **Auth:** Protected (Customer)
- **Purpose:** Retrieves all foods favorited by the user.

### `POST /api/favorites`
- **Auth:** Protected (Customer)
- **Purpose:** Toggles favorite status for a food item.
- **Request Body:** `{ "foodId": "..." }`
