# API Key

  The API key management system allows brands to generate, retrieve, and delete API keys, which are used to authenticate and authorize API requests.

### 1. API Key Entity

The `Apikey` entity represents the structure of an API key in the database. It includes fields such as the API key itself, permissions, expiration date, and relationships with the Brand entity.

#### Fields:

- `id`: Unique identifier for the API key (UUID).
- `apikey`: The actual API key string.
- `isActive`: Indicates whether the API key is active.
- `isDefault`: Indicates if the API key is the default key for the brand.
- `storageSize`: The storage size allocated to the API key.
- `write_permission`: Indicates if the API key has write permissions.
- `delete_permission`: Indicates if the API key has delete permissions.
- `brandId`: The ID of the brand associated with the API key.
- `brand`: Relationship with the Brand entity.
- `expireAt`: The expiration date of the API key.
- `createdAt`, `updatedAt`, `deletedAt`: Timestamps for creation, update, and deletion.

#### Methods:

- `toJSON()`: Converts the entity instance to a plain object, excluding sensitive data.

### 2. API Key Service

The `ApikeyService` handles the business logic for API key management, including creation, deletion, and retrieval of API keys.

#### Methods:

- `createApikey(args)`: Creates a new API key for a brand.

  **Parameters:**
  
  - `brandId`: The ID of the brand.
  - `isDefault`: Whether the key is the default key.
  - `storageSize`: The storage size allocated.
  - `expireAt`: The expiration date.
  - `writePermission`: Write permissions.
  - `deletePermission`: Delete permissions.
  
  **Returns:** The generated API key string.

- `deleteApiKey(id)`: Deletes an API key by its ID.
- `deleteApiKeyByBrandId(args)`: Deletes an API key by brand ID and API key string.
- `findApiKeyById(id)`: Retrieves an API key by its ID.
- `findApiKeysByBrandId(brandId)`: Retrieves all API keys for a specific brand.

### 3. API Key Controller

The `ApikeyController` exposes endpoints for managing API keys. It uses the `AuthGuard` to ensure that only authenticated users can access these endpoints.

#### Endpoints:

- `GET /apikey`: Retrieves all API keys for the authenticated brand.
- `POST /apikey`: Creates a new API key.
  
  **Body:** `ApikeyDto` containing `isDefault`, `storageSize`, `expireAt`, `writePermission`, and `deletePermission`.

- `DELETE /apikey/:apikey`: Deletes a specific API key.

### 4. API Key Guard

The `ApikeyGuard` is used to protect routes that require API key authentication. It verifies the API key and checks if the brand has the necessary permissions to perform the requested action.

#### Methods:

- `canActivate(context)`: Verifies the API key and checks permissions.
  
  **Checks:**
  
  - If the API key is valid.
  - If the brand has the required permissions for the requested route (e.g., write or delete permissions).

#### Imports:

- `TypeOrmModule.forFeature([Apikey, Brand])`: Registers the `Apikey` and `Brand` entities with TypeORM.

### 5. API Key DTO

The `ApikeyDto` defines the structure of the data required to create a new API key and the `types.ts` file defines the response structure.

#### Fields:

- `isDefault`: Whether the key is the default key.
- `storageSize`: The storage size allocated.
- `expireAt`: The expiration date.
- `writePermission`: Write permissions.
- `deletePermission`: Delete permissions.

#### Interfaces:

- `ApikeysResponse`: Extends `CoreApiResponse` and includes an array of `Apikey` entities.

### 6. Integration

The API key management system integrates with the following modules:

- `AuthModule`: Ensures that only authenticated users can manage API keys.
- `BrandModule`: Associates API keys with specific brands.
- `FileModule`: Uses API keys to authorize file uploads and deletions.