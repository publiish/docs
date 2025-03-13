---
sidebar_position: 3
---

# Brand Permissions API

Authentication methods may change in the near future.

### Overview
This document outlines the API endpoints and database schema related to managing brand permissions in the system.

### Database Schema
The `Brand` entity represents organizations registered in the system. The permissions determine what actions a brand can perform.

### **Brand Entity**

```typescript
@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: true })
  brand_name?: string;

  @Column({ length: 200, nullable: true })
  brand_url?: string;

  @Column('int', { nullable: true })
  dao_id?: number;

  @Column({ length: 100, nullable: true })
  email?: string;

  @Exclude()
  @Column({ length: 100, nullable: true })
  password?: string;

  @Column({ length: 200, nullable: true })
  sub_domain?: string;

  @Column({ default: true })
  write_permission: boolean;

  @Column({ default: true })
  delete_permission: boolean;
}
```

### Authentication

### **1. Sign Up**
**Endpoint:**
```
POST /auth/signup
```
**Request Body:**
```json
{
  "email": "example@example.com",
  "password": "Password12@",
  "brand_name": "Brand1"
}
```
**Response:**
```json
{
  "success": "Y",
  "status": 200,
  "brand": {
    "id": 1,
    "email": "example@example.com",
    "brand_name": "Brand2"
  }
}
```
**Error Responses:**
- `409 CONFLICT`: Brand or email already exists

---

### **2. Sign In**
**Endpoint:**
```
POST /auth/signin
```
**Request Body:**
```json
{
  "email": "example@example.com",
  "password": "Password12@"
}
```
**Response:**
```json
{
  "success": "Y",
  "status": 200,
  "access_token": "jwt_token_here"
}
```
**Error Responses:**
- `404 NOT FOUND`: Brand does not exist
- `400 BAD REQUEST`: Incorrect credentials
- `401 UNAUTHORIZED`: Access token denied

---

### **3. Get All Brands**
**Endpoint:**
```
GET /auth/brands
```
**Response:**
```json
{
  "success": "Y",
  "status": 200,
  "brands": [
    {
      "id": 1,
      "email": "example@example.com",
      "brand_name": "BrandName"
    }
  ]
}
```
---

### **4. Change Brand Permission**
**Endpoint:**
```
POST /auth/change_permission
```

**Request Body:**
```json
{
  "id": 1,
  "column": "write_permission",
  "action": true
}
```

**Response:**
```json
{
  "success": "Y",
  "status": 200,
  "message": "Permission changed successfully."
}
```

### **Permissions Available**
The `column` field in the request body must be one of the following:
- `write_permission`
- `delete_permission`

### **5. Get Brand Stats**
**Endpoint:**
```
GET /brands/stats/:id
```
**Response:**
```json
{
  "success": "Y",
  "status": 200,
  "data": {
    "bytes_uploaded": 10240,
    "files_uploaded": 5
  }
}
```
**Error Responses:**
- `404 NOT FOUND`: Brand not found

---

### Enhancements
Add more granular permissions. Implement role-based access control (RBAC) for managing permissions at a higher level.

### Error Message Reference

| Error Code | Message |
|------------|----------------------------------|
| 409 CONFLICT | Brand or email already exists |
| 404 NOT FOUND | Brand does not exist |
| 400 BAD REQUEST | Incorrect credentials |
| 401 UNAUTHORIZED | Access token denied |
| 500 INTERNAL SERVER ERROR | Something went wrong |

---

