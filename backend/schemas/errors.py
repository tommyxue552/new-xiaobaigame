"""Unified error codes for the entire application.

Error code ranges:
  1000-1999  Authentication / Authorization
  2000-2999  Validation / Business Logic
  3000-3999  Resource (Not Found, Conflict)
  4000-4999  File / Upload
  5000-5999  Server / Infrastructure
"""

from enum import IntEnum


class ErrorCode(IntEnum):
    # --- Auth (1000-1999) ---
    AUTH_INVALID_CREDENTIALS = 1000
    AUTH_TOKEN_EXPIRED = 1001
    AUTH_TOKEN_INVALID = 1002
    AUTH_PERMISSION_DENIED = 1003
    AUTH_ACCOUNT_DISABLED = 1004
    AUTH_EMAIL_NOT_VERIFIED = 1005

    # --- Validation (2000-2999) ---
    VALIDATION_ERROR = 2000
    VALIDATION_DUPLICATE = 2001
    VALIDATION_BUSINESS_RULE = 2002

    # --- Resource (3000-3999) ---
    RESOURCE_NOT_FOUND = 3000
    RESOURCE_CONFLICT = 3001
    RESOURCE_GONE = 3002

    # --- Upload (4000-4999) ---
    UPLOAD_SIZE_EXCEEDED = 4000
    UPLOAD_TYPE_NOT_ALLOWED = 4001
    UPLOAD_FAILED = 4002

    # --- Server (5000-5999) ---
    SERVER_INTERNAL_ERROR = 5000
    SERVER_DATABASE_ERROR = 5001
    SERVER_S3_ERROR = 5002
    SERVER_RATE_LIMITED = 5003


ERROR_MESSAGES: dict[ErrorCode, str] = {
    ErrorCode.AUTH_INVALID_CREDENTIALS: "Invalid credentials",
    ErrorCode.AUTH_TOKEN_EXPIRED: "Token has expired",
    ErrorCode.AUTH_TOKEN_INVALID: "Token is invalid",
    ErrorCode.AUTH_PERMISSION_DENIED: "Permission denied",
    ErrorCode.AUTH_ACCOUNT_DISABLED: "Account is disabled",
    ErrorCode.AUTH_EMAIL_NOT_VERIFIED: "Email not verified",
    ErrorCode.VALIDATION_ERROR: "Validation error",
    ErrorCode.VALIDATION_DUPLICATE: "Duplicate entry",
    ErrorCode.VALIDATION_BUSINESS_RULE: "Business rule violation",
    ErrorCode.RESOURCE_NOT_FOUND: "Resource not found",
    ErrorCode.RESOURCE_CONFLICT: "Resource conflict",
    ErrorCode.RESOURCE_GONE: "Resource no longer available",
    ErrorCode.UPLOAD_SIZE_EXCEEDED: "Upload size exceeded",
    ErrorCode.UPLOAD_TYPE_NOT_ALLOWED: "File type not allowed",
    ErrorCode.UPLOAD_FAILED: "Upload failed",
    ErrorCode.SERVER_INTERNAL_ERROR: "Internal server error",
    ErrorCode.SERVER_DATABASE_ERROR: "Database error",
    ErrorCode.SERVER_S3_ERROR: "Storage service error",
    ErrorCode.SERVER_RATE_LIMITED: "Too many requests",
}
