# UCAN token

The module handles UCAN token generation and refresh operations.

### 1. UCAN Controller

The `UcanController` exposes endpoints for UCAN related operations.

### Endpoints:

- **POST** `/ucan/token`: Generates or refreshes a UCAN token.
  - **Request**: The request object containing the authenticated user and UCAN token.
  - **Returns**: The generated or refreshed UCAN token.

### 2. UCAN Service

The `UcanService` handles the business logic for UCAN token generation and refresh operations.

#### Methods:

- **`ucanToken(args)`**: Generates or refreshes a UCAN token.
  - **Parameters:**
    - `user`: The authenticated user.
    - `authType`: The type of authentication (`ucan` or `key`).
    - `ucanToken`: The existing UCAN token (if refreshing).
  - **Returns**: The generated or refreshed UCAN token.

#### Imports:

- `TypeOrmModule.forFeature([Brand])`: Registers the `Brand` entity with TypeORM.

### 3. Integration

The UCAN module integrates with the following modules:

- **AuthGuard**: Ensures that only authenticated users can perform UCAN-related operations.
- **BrandModule**: Associates UCAN operations with specific brands.

### 4. Usage Example

#### Generating a UCAN Token:

```typescript
const ucanTokenArgs = {
  user: authenticatedUser,
  authType: 'key',
  ucanToken: null,
};

const response = await this.ucanService.ucanToken(ucanTokenArgs);
```

### Refreshing a UCAN Token:

```typescript
const ucanTokenArgs = {
  user: authenticatedUser,
  authType: 'ucan',
  ucanToken: existingUcanToken,
};

const response = await this.ucanService.ucanToken(ucanTokenArgs);
```