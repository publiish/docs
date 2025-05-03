# Authentication System

The Authentication module provides a comprehensive system for user registration, authentication, and permission management for brands using the Publiish platform.

## 1. Brand Entity Schema

The `Brand` entity is the core data structure representing a registered user/organization in the system with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `id` | UUID | Unique identifier for the brand |
| `email` | String | Email address used for authentication |
| `password` | String | Securely hashed password |
| `brand_name` | String | Display name of the brand or organization |
| `magic_link_id` | String | Identifier for Magic Link authentication |
| `public_address` | String | Blockchain/wallet address for web3 authentication |
| `write_permission` | Boolean | Permission to perform write operations |
| `delete_permission` | Boolean | Permission to perform delete operations |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Last update timestamp |

## 2. Authentication Service

The `AuthService` implements core business logic for identity management and access control within the platform.

### Methods

#### `signup(req, brand_name)`
Registers a new brand in the system.

**Parameters:**
- `req`: Request - The HTTP request object containing authorization token
- `brand_name`: String - The name of the brand to register

**Returns:** Brand - The newly registered brand entity

**Process:**
1. Extracts user information from authorization token
2. Validates input data
3. Creates new brand record with appropriate permissions
4. Returns the created brand entity

#### `signin(req)`
Authenticates a brand and generates access credentials.

**Parameters:**
- `req`: Request - The HTTP request object containing authorization token

**Returns:** Object - Contains access token for subsequent authenticated requests

**Process:**
1. Verifies credentials from authorization token
2. Generates JWT or UCAN token based on authentication method
3. Returns token with appropriate expiration

#### `get_brands()`
Retrieves all registered brands in the system.

**Returns:** Array&lt;Brand&gt; - List of all brand entities

#### `change_permission(id, column, action)`
Updates permission settings for a specific brand.

**Parameters:**
- `id`: UUID - The ID of the brand to modify
- `column`: String - The permission to update (`write_permission` or `delete_permission`)
- `action`: Boolean - The new permission value (true/false)

**Returns:** Object - Success confirmation message

## 3. Authentication Controller

The `AuthController` exposes RESTful endpoints for authentication and permission management operations.

### Endpoints

#### `POST /auth/signup`
Registers a new brand in the system.

**Request Body:**
```json
{
  "brand_name": "Example Brand"
}
```

**Response:** SignupResponse - Contains the registered brand details

#### `POST /auth/signin`
Authenticates a brand and provides access token.

**Request Body:**
```json
{
  "email": "brand@example.com",
  "password": "secure_password"
}
```

**Response:** SigninResponse - Contains the access token

#### `POST /auth/change_permission`
Updates permission settings for a brand.

**Request Body:**
```json
{
  "id": "uuid-string",
  "column": "write_permission",
  "action": true
}
```

**Response:** PermissionResponse - Contains success confirmation

#### `GET /auth/brands`
Retrieves all registered brands.

**Response:** BrandResponse - Contains list of all brands

## 4. Authentication Guard

The `AuthGuard` implements route protection to ensure only authenticated users with appropriate permissions can access specific endpoints.

### Functionality

#### `canActivate(context)`
Verifies the authentication token and checks permission requirements.

**Verification Process:**
1. Extracts JWT or UCAN token from request headers
2. Validates token signature and expiration
3. Checks if the brand has required permissions for the requested route
4. Attaches brand identity to request for downstream handlers
5. Grants or denies access based on verification results

## 5. Authentication Data Structures

### Request DTOs

```typescript
export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  brand_name: string;
}

export class SignInDto {
  @IsEmail()
  email: string;
  
  @IsString()
  @MinLength(8)
  password: string;
}

export class PermissionDto {
  @IsUUID()
  id: string;
  
  @IsIn(['write_permission', 'delete_permission'])
  column: string;
  
  @IsBoolean()
  action: boolean;
}
```

### Response Interfaces

```typescript
export interface SignupResponse extends CoreApiResponse {
  data: Brand;
}

export interface SigninResponse extends CoreApiResponse {
  data: {
    access_token: string;
  };
}

export interface BrandResponse extends CoreApiResponse {
  data: Brand[];
}

export interface PermissionResponse extends CoreApiResponse {
  data: string; // Success message
}

export interface RequestWithUser extends Request {
  user: Brand;
  token: string;
}
```

## 6. Authentication Methods

The system supports multiple authentication methods:

1. **Email/Password**: Traditional username and password authentication
2. **Magic Link**: Passwordless authentication via email links
3. **Web3 Authentication**: Using blockchain wallets and signatures

Each method follows a secure authentication flow with appropriate token generation and validation processes.

## 7. Integration

The Authentication system integrates with these core modules:

- **BrandModule**: Manages brand identity and profile information
- **JwtModule**: Handles JSON Web Token generation and verification
- **MagicModule**: Provides passwordless authentication capabilities