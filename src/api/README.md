# API Structure

## Overview

This directory contains all API-related functionality for the Mafia Game client.

## Structure

```
src/api/
├── index.ts              # Main export file
├── authProxy.ts          # Auth API proxy functions for Next.js routes
├── selfProxy.ts          # Self API proxy functions for Next.js routes
├── auth/                 # Authentication API
│   └── index.ts         # Auth API functions (login, signup, logout, etc.)
├── self/                 # User profile API
│   └── index.ts         # Self API functions (getProfile, updateProfile, uploadAvatar)
└── API_URL/             # API configuration
    └── index.ts         # Base API URL configuration
```

## Usage

### Importing API functions

```typescript
import { authAPI, selfAPI } from '@/api';
// or
import { authAPI } from '@/api/auth';
import { selfAPI } from '@/api/self';
```

### Authentication

```typescript
// Login
const response = await authAPI.login({ email, password });

// Signup
const response = await authAPI.signup({ email, password, nickname });

// Logout
const response = await authAPI.logout();

// Verify token
const response = await authAPI.verifyToken();
```

### User Profile

```typescript
// Get profile
const response = await selfAPI.getProfile();

// Update profile
const response = await selfAPI.updateProfile({ nickname, name, city });

// Upload avatar
const response = await selfAPI.uploadAvatar(file);
```

## Next.js API Routes

The proxy files (`authProxy.ts`, `selfProxy.ts`) are used by Next.js API routes to handle CORS and proxy requests to the external API server.

### Routes

- `/api/auth/[...path]` - Authentication endpoints
- `/api/self/[...path]` - User profile endpoints

## Configuration

The base API URL is configured in `API_URL/index.ts` and points to the production server.
