# API Key Management

The API key management system provides a secure way to generate, retrieve, and delete API keys for authenticating and authorizing requests to the Publiish platform.

## 1. API Key Entity Schema

The `Apikey` entity represents the structure of an API key in the database with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `id` | UUID | Unique identifier for the API key |
| `apikey` | String | The actual API key string used for authentication |
| `isActive` | Boolean | Flag indicating whether the API key is currently active |
| `isDefault` | Boolean | Flag indicating if this is the default key for the brand |
| `storageSize` | Number | Storage allocation for this API key in bytes |
| `write_permission` | Boolean | Permission to perform write operations |
| `delete_permission` | Boolean | Permission to perform delete operations |
| `brandId` | UUID | Reference to the associated brand |
| `brand` | Relation | Relationship to the Brand entity |
| `expireAt` | Date | Expiration timestamp for the API key |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Last update timestamp |
| `deletedAt` | Date | Soft deletion timestamp (if applicable) |

### Methods

- **`toJSON()`**: Converts the entity instance to a plain object, excluding sensitive information for secure serialization.

## 2. API Key Service

The `ApikeyService` implements the business logic for API key management with the following operations:

### Methods

#### `createApikey(args)`
Creates a new API key for a brand with specified permissions.

**Parameters:**
- `brandId`: UUID - The ID of the brand
- `isDefault`: Boolean - Whether this is the default key
- `storageSize`: Number - Allocated storage in bytes
- `expireAt`: Date - Expiration timestamp
- `writePermission`: Boolean - Write permission flag
- `deletePermission`: Boolean - Delete permission flag

**Returns:** String - The generated API key

#### `deleteApiKey(id)`
Deletes an API key by its unique identifier.

**Parameters:**
- `id`: UUID - The ID of the API key to delete

**Returns:** Object - Result of the deletion operation

#### `deleteApiKeyByBrandId(args)`
Deletes an API key using brand ID and API key string.

**Parameters:**
- `brandId`: UUID - The ID of the brand
- `apikey`: String - The API key string to delete

**Returns:** Object - Result of the deletion operation

#### `findApiKeyById(id)`
Retrieves an API key by its unique identifier.

**Parameters:**
- `id`: UUID - The ID of the API key to retrieve

**Returns:** Apikey - The retrieved API key entity

#### `findApiKeysByBrandId(brandId)`
Retrieves all API keys associated with a specific brand.

**Parameters:**
- `brandId`: UUID - The ID of the brand

**Returns:** Array&lt;Apikey&gt; - List of API keys for the brand

## 3. API Key Controller

The `ApikeyController` exposes RESTful endpoints for API key management, secured by `AuthGuard`.

### Endpoints

#### `GET /apikey`
Retrieves all API keys for the authenticated brand.

**Response:** ApikeysResponse - List of API keys

#### `POST /apikey`
Creates a new API key with specified parameters.

**Request Body:** ApikeyDto
```json
{
  "isDefault": boolean,
  "storageSize": number,
  "expireAt": ISO8601 date string,
  "writePermission": boolean,
  "deletePermission": boolean
}
```

**Response:** Apikey - The newly created API key

#### `DELETE /apikey/:apikey`
Deletes a specific API key.

**Path Parameters:**
- `apikey`: String - The API key to delete

**Response:** SuccessResponse - Confirmation of deletion

## 4. API Key Guard

The `ApikeyGuard` protects routes that require API key authentication by implementing permissions verification.

### Core Functionality

#### `canActivate(context)`
Verifies the API key and checks permissions for the requested route.

**Verification Process:**
1. Extracts API key from request headers
2. Validates API key existence and activity status
3. Checks if the brand has appropriate permissions (write/delete) for the requested route
4. Grants or denies access based on permission validation

## 5. API Key Data Structures

### ApikeyDto
Defines the structure for API key creation requests:

```typescript
export class ApikeyDto {
  @IsBoolean()
  isDefault: boolean;
  
  @IsNumber()
  storageSize: number;
  
  @IsDateString()
  expireAt: string;
  
  @IsBoolean()
  writePermission: boolean;
  
  @IsBoolean()
  deletePermission: boolean;
}
```

### Response Interfaces

```typescript
export interface ApikeysResponse extends CoreApiResponse {
  data: Apikey[];
}
```

## 6. Integration

The API key management system integrates with these core modules:

- **AuthModule**: Enforces authentication for API key management operations
- **BrandModule**: Associates API keys with specific brands and their permissions
- **FileModule**: Uses API keys for authorizing file operations and enforcing permissions