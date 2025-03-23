---
sidebar_position: 2
---

# Brand Operations

This module handles brand related operations, including profile management, DID registration, and statistics retrieval.

### 1. Brand Entity

The Brand entity represents the structure of a brand in the database. It includes fields such as brand name, URL, email, permissions, and relationships with other entities.

#### Fields:
- `id`: Unique identifier for the brand.
- `magic_link_id`: The ID used for Magic Link authentication.
- `did`: The Decentralized Identifier (DID) associated with the brand.
- `public_address`: The public address associated with the brand.
- `brand_name`: The name of the brand.
- `brand_url`: The URL of the brand.
- `dao_id`: The ID of the DAO associated with the brand.
- ``email`: The email address of the brand.
- `password`: The hashed password for the brand.
- `sub_domain`: The subdomain associated with the brand.
- `write_permission`: Indicates if the brand has write permissions.
- `delete_permission`: Indicates if the brand has delete permissions.
- `apikeys`: Relationship with the Apikey entity.

#### Methods:
- `toJSON()`: Converts the entity instance to a plain object, excluding sensitive data.

### 2. Brand Service

The BrandService handles the business logic for brand related operations, including profile updates, DID registration, and statistics retrieval.

#### Methods:
- **getStats(id)**: Retrieves statistics for a brand.
  - **Parameters**:
    - `id`: The ID of the brand.
  - **Returns**: Statistics including the number of files uploaded and total bytes uploaded.

- **updateBrandProfile(args)**: Updates the profile of a brand.
  - **Parameters**:
    - `id`: The ID of the brand.
    - `brandName`: The new name of the brand.
    - `brandUrl`: The new URL of the brand.
    - `subDomain`: The new subdomain of the brand.
    - `daoId`: The new DAO ID associated with the brand.
  - **Returns**: A success message.

- **registerDID(args)**: Registers a DID for a brand.
  - **Parameters**:
    - `id`: The ID of the brand.
    - `did`: The DID to register.
  - **Returns**: A success message.

### 3. Brand Controller

The BrandController exposes endpoints for brand related operations.

#### Endpoints:
- **GET /brands/stats/:id**: Retrieves statistics for a brand.
  - **Parameters**:
    - `id`: The ID of the brand.
  - **Returns**: Statistics including the number of files uploaded and total bytes uploaded.

- **POST /brands**: Updates the profile of a brand.
  - **Body**: `ProfileDto` containing `brand_name`, `brand_url`, `dao_id`, and `sub_domain`.
  - **Returns**: A success message.

- **POST /brands/did**: Registers a DID for a brand.
  - **Body**: `DIDDto` containing `did`.
  - **Returns**: A success message.

#### Imports:
- `TypeOrmModule.forFeature([Brand, File])`: Registers the Brand and File entities with TypeORM.

### 4. Brand DTOs

The DTOs define the structure of the data required for brand related operations and the `types.ts` file defines the response structures.

#### DTOs:
- **ProfileDto**: Contains `brand_name`, `brand_url`, `dao_id`, and `sub_domain`.
- **DIDDto**: Contains `did`.

#### Interfaces:
- **StatsResponse**: Extends `CoreApiResponse` and includes statistics for a brand.

### 5. Integration

The brand module integrates with the following modules:

- **AuthModule**: Ensures that only authenticated users can perform brand related operations.
- **FileModule**: Retrieves file related statistics for brands.