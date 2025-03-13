# Authentication

This module handles user signup, signin, and permission management for brands.

### 1. Auth Entity

The `Brand` entity represents the structure of a brand in the database. It includes fields such as email, password, brand name, and permissions.

#### Fields:

- `id`: Unique identifier for the brand.
- `email`: The email address of the brand.
- `password`: The hashed password for the brand.
- `brand_name`: The name of the brand.
- `magic_link_id`: The ID used for Magic Link authentication.
- `public_address`: The public address associated with the brand.
- `write_permission`: Indicates if the brand has write permissions.
- `delete_permission`: Indicates if the brand has delete permissions.

### 2. Auth Service

The `AuthService` handles the business logic for authentication, including signup, signin, and permission management.

#### Methods:

- `signup(req, brand_name)`: Registers a new brand.
  
  **Parameters:**
  
  - `req`: The request object containing the authorization token.
  - `brand_name`: The name of the brand.
  
  **Returns:** The registered brand details.

- `signin(req)`: Authenticates a brand and returns an access token.
  
  **Parameters:**
  
  - `req`: The request object containing the authorization token.
  
  **Returns:** An access token for the authenticated brand.

- `get_brands()`: Retrieves all brands.
  
  **Returns:** A list of all brands.

- `change_permission(id, coloumn, action)`: Updates the permissions for a brand.
  
  **Parameters:**
  
  - `id`: The ID of the brand.
  - `coloumn`: The permission column to update (`write_permission` or `delete_permission`).
  - `action`: The new permission value (`true` or `false`).
  
  **Returns:** A success message.

### 3. Auth Controller

The `AuthController` exposes endpoints for authentication and permission management.

#### Endpoints:

- `POST /auth/signup`: Registers a new brand.
  
  **Body:** `SignUpDto` containing `brand_name`.
  
  **Returns:** The registered brand details.

- `POST /auth/signin`: Authenticates a brand.
  
  **Body:** `SignInDto` containing `email` and `password`.
  
  **Returns:** An access token.

- `POST /auth/change_permission`: Updates the permissions for a brand.
  
  **Body:** `PermissionDto` containing `id`, `coloumn`, and `action`.
  
  **Returns:** A success message.

- `GET /auth/brands`: Retrieves all brands.
  
  **Returns:** A list of all brands.

### 4. Auth Guard

The `AuthGuard` is used to protect routes that require authentication. It verifies the JWT token or UCAN token and checks if the brand has the necessary permissions to perform the requested action.

#### Methods:

- `canActivate(context)`: Verifies the token and checks permissions.
  
  **Checks:**
  
  - If the token is valid (JWT or UCAN).
  - If the brand has the required permissions for the requested route (e.g., write or delete permissions).


#### Imports:

- `TypeOrmModule.forFeature([Brand])`: Registers the `Brand` entity with TypeORM.

### 5. Auth DTOs

The DTOs define the structure of the data required for authentication and permission management and the `types.ts` file defines the response structures for authentication related operations.

#### DTOs:

- `SignUpDto`: Contains `brand_name`.
- `SignInDto`: Contains `email` and `password`.
- `PermissionDto`: Contains `id`, `coloumn`, and `action`.

#### Interfaces:

- `SignupResponse`: Extends `CoreApiResponse` and includes the registered brand details.
- `SigninResponse`: Extends `CoreApiResponse` and includes an access token.
- `BrandResponse`: Extends `CoreApiResponse` and includes a list of brands.
- `PermissionResponse`: Extends `CoreApiResponse` and includes a success message.
- `RequestWithUser`: Extends `Request` and includes the authenticated brand and token details.

### 6. Integration

The authentication module integrates with the following modules:

- `BrandModule`: Manages brand-related operations.
- `JwtModule`: Handles JWT token generation and verification.
- `Magic`: Handles Magic Link authentication.

### 7. Usage Example

#### Signing Up:

```typescript
const signUpDto = {
  brand_name: 'Example Brand',
};

const response = await this.authService.signup(req, signUpDto.brand_name);
```

#### Signing In:

```typescript
const signInDto = {
  email: 'example@example.com',
  password: 'Password12@',
};

const response = await this.authService.signin(req);
```

#### Changing Permissions:

```typescript
const permissionDto = {
  id: 1,
  coloumn: 'write_permission',
  action: true,
};

const response = await this.authService.change_permission(permissionDto.id, permissionDto.coloumn, permissionDto.action);
```

#### Retrieving Brands:

```typescript
const response = await this.authService.get_brands();
```