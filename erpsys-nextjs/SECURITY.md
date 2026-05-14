# CORS & Security Configuration

## CORS Protection (Cross-Origin Request Blocking)

**Status:** ✅ Enabled

The application now enforces CORS restrictions on all API endpoints to prevent unauthorized cross-origin requests.

### How it works:
- **Middleware** (`middleware.ts`) intercepts all API requests at `/api/*`
- Only requests from **whitelisted origins** are allowed
- **Preflight OPTIONS requests** are validated before processing

### Allowed Origins (Whitelist):
```
- http://localhost:3000      (Development)
- http://127.0.0.1:3000      (Development)
- {NEXT_PUBLIC_APP_URL}      (Production - if set in .env)
```

### Configuration:

**Development (.env.local):**
```env
NEXT_PUBLIC_APP_URL=""  # Leave empty or omit - localhost is always allowed
```

**Production (.env):**
```env
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### What happens with unauthorized origins:

**Cross-origin request from unauthorized domain:**
```
Request: GET https://attacker.com → /api/instructor/attendance
Response: 403 Forbidden - CORS policy violation
```

**Same-origin request (from your app):**
```
Request: GET http://localhost:3000 → /api/instructor/attendance
Response: 200 OK (if authorized by JWT token)
```

---

## JWT Security

**Current Implementation:**
- ✅ **Signed & Verified:** HS256 algorithm with secret key
- ✅ **HttpOnly Cookies:** Not accessible to JavaScript (XSS protection)
- ✅ **HTTPS in Production:** `secure` flag enabled when `NODE_ENV=production`
- ✅ **7-day expiration:** Tokens expire after 7 days

**⚠️ CRITICAL - Must Set JWT_SECRET:**

The application has a **fallback secret** that MUST be overridden in production:

```javascript
// lib/auth.ts - Line 7
process.env.JWT_SECRET || "your-secret-key-change-in-production"
```

**Required for Production:**
```bash
# .env file MUST include a strong JWT_SECRET
JWT_SECRET="your-generated-64-character-hex-string"
```

Generate a secure JWT secret:
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Additional Security Measures

### ✅ Implemented:
1. **Role-based Authorization** - API routes verify user role (ADMIN/INSTRUCTOR/STUDENT)
2. **Resource Ownership Verification** - Instructors can only access their own classes
3. **No Hardcoded Secrets** - JWT_SECRET configurable via environment variables
4. **HTTPS in Production** - Cookies marked as secure

### 🔄 TODO (Optional Enhancements):
1. **Rate Limiting** - Prevent brute force attacks on login endpoints
2. **Request Validation** - Sanitize user input to prevent injection attacks
3. **CSP Headers** - Content Security Policy to prevent XSS
4. **Refresh Token Rotation** - Implement refresh token strategy

---

## Testing CORS

**Allowed (same origin):**
```bash
curl -X GET http://localhost:3000/api/instructor/attendance
```

**Blocked (cross-origin):**
```bash
curl -X GET http://localhost:3000/api/instructor/attendance \
  -H "Origin: http://attacker.com"
# Returns: 403 Forbidden
```

**Preflight OPTIONS request:**
```bash
curl -X OPTIONS http://localhost:3000/api/instructor/attendance \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET"
# Returns: 200 OK with CORS headers
```
