# Payment Logs Feature - Admin Panel

## Overview
The Payment Logs feature provides comprehensive monitoring and analysis of payment transactions with a modern, intuitive UI. Built following SOLID principles (SRP & DRY), this feature allows admins to view, search, and analyze payment logs with detailed statistics.

## Architecture

### 1. Repository Layer (`repository/admin/paymentLogs.ts`)
**Single Responsibility:** Data access and log parsing

**Functions:**
- `getPaymentLogsByDate(date: string)` - Fetch logs for specific date
- `getTodayPaymentLogs()` - Fetch today's logs
- `parseRawLogs(rawLogs: string)` - Parse S3 log strings into structured data

**Data Structure:**
```typescript
interface PaymentLog {
  timestamp: string;
  message: string;
  type: "payment.captured" | "payment.failed" | "info" | "error";
}
```

### 2. Service Layer (`utils/admin/paymentLogService.ts`)
**Single Responsibility:** Business logic and data transformation

**Functions:**
- `fetchPaymentLogsByDate(date: string)` - Get logs with stats and validation
- `fetchTodayPaymentLogs()` - Get today's logs with stats
- `extractPaymentDetails(log: PaymentLog)` - Parse payment information from logs

**Features:**
- Date format validation (YYYY-MM-DD)
- Statistics calculation (captured, failed, errors, info)
- Payment detail extraction (ID, amount, currency, order ID, status)

### 3. Custom Hooks (`utils/admin/usePaymentLogs.ts`)
**Single Responsibility:** State management for React components

**Hooks:**
- `useTodayPaymentLogs()` - Auto-fetch today's logs on mount
- `usePaymentLogsByDate(date: string)` - Fetch logs for specific date

**Returns:**
```typescript
{
  logs: PaymentLog[];
  stats: PaymentLogStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
```

### 4. API Routes

#### GET `/api/v1/logs/today`
**Purpose:** Fetch today's payment logs with statistics

**Authentication:** Admin only (JWT token verification)

**Response:**
```json
{
  "message": "Payment logs fetched successfully",
  "success": true,
  "date": "2025-11-17",
  "logs": [...],
  "stats": {
    "totalLogs": 45,
    "capturedPayments": 30,
    "failedPayments": 10,
    "errors": 2,
    "infoLogs": 3
  }
}
```

#### POST `/api/v1/logs/bydate`
**Purpose:** Fetch payment logs for specific date

**Authentication:** Admin only

**Request Body:**
```json
{
  "date": "2025-11-15"
}
```

**Validation:**
- Date format must be YYYY-MM-DD
- Date validation for valid calendar dates

**Response:** Same structure as today endpoint

### 5. UI Components (`app/admin/payment-logs/page.tsx`)

#### Main Features:
1. **View Mode Tabs**
   - Today's Logs (auto-load)
   - By Date (with date picker)

2. **Statistics Dashboard**
   - Total Logs
   - Captured Payments (green)
   - Failed Payments (red)
   - Errors (orange)
   - Info Logs (purple)

3. **Search & Filter**
   - Real-time search across log messages
   - Filter by log type (all, captured, failed, error, info)

4. **Log Cards**
   - Color-coded by type
   - Payment details preview
   - Timestamp display
   - Click to view full details

5. **Detail Modal**
   - Full log message
   - Extracted payment details
   - Formatted timestamp
   - Payment ID, Order ID, Amount, Status

## Design System

### Color Scheme (matching admin category design):
- **Primary Gradient:** `from-[#F9A825] to-[#2B9EB3]`
- **Success/Captured:** Green (`from-green-50 to-green-100`)
- **Error/Failed:** Red/Orange (`from-red-50 to-orange-50`)
- **Warning:** Orange (`from-orange-50 to-yellow-50`)
- **Info:** Blue (`from-blue-50 to-cyan-50`)

### UI Components:
- **StatsCard:** Displays metrics with icons and gradients
- **LogCard:** Interactive card with payment details preview
- **LogDetailModal:** Full-screen modal with complete log information
- **Search Bar:** Icon-based search with real-time filtering
- **Filter Dropdown:** Type-based filtering

## Edge Cases Handled

### 1. Authentication
- ✅ Unauthorized access (non-admin users)
- ✅ Invalid/expired tokens
- ✅ Missing authentication credentials

### 2. Data Validation
- ✅ Invalid date formats
- ✅ Future dates
- ✅ Non-existent dates (e.g., Feb 30)
- ✅ Empty or malformed log data

### 3. Error Handling
- ✅ S3 connection failures
- ✅ Missing log files
- ✅ Corrupted log data
- ✅ JSON parsing errors
- ✅ Network timeouts

### 4. UI/UX
- ✅ Empty state (no logs found)
- ✅ Loading states with spinners
- ✅ Error messages with retry options
- ✅ Long log messages (truncation with "...")
- ✅ Mobile responsiveness
- ✅ Dark mode support

### 5. Performance
- ✅ Efficient log parsing
- ✅ Debounced search (implicit through React state)
- ✅ Lazy rendering with Framer Motion
- ✅ Optimized re-renders with useCallback

## Usage Examples

### Admin Access Payment Logs:
1. Navigate to `/admin/payment-logs` or click "Payment Logs" in sidebar
2. View today's logs automatically loaded
3. Use search bar to find specific transactions
4. Click on any log card to view full details
5. Switch to "By Date" tab to view historical logs

### Filter Payment Logs:
1. Use the filter dropdown to select log type
2. Search for specific payment IDs, amounts, or keywords
3. Click refresh to reload latest data

### Analyze Payment Statistics:
1. View stats cards at top of page
2. Check captured vs failed payment ratio
3. Monitor error rates
4. Identify patterns in payment issues

## Integration with Existing System

### Navigation:
- Added to `useAdminNavigation.ts` with IconFileText
- Positioned between "Fees" and "Analytics"
- Accessible from all admin pages via sidebar

### Authentication:
- Uses existing `verifyUserToken` utility
- Follows admin-only route pattern
- Cookie-based JWT authentication

### Styling:
- Matches admin category page design
- Uses same color gradients and borders
- Consistent card layouts and animations
- Shared sidebar and header components

## API Endpoints Summary

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/v1/logs/today` | GET | Admin | Today's logs with stats |
| `/api/v1/logs/bydate` | POST | Admin | Historical logs by date |

## Dependencies
- `@aws-sdk/client-s3` - S3 log storage
- `framer-motion` - Animations
- `@tabler/icons-react` - Icons
- `sonner` - Toast notifications
- `next` - Framework

## SOLID Principles Applied

### Single Responsibility Principle (SRP):
- **Repository:** Only handles data access
- **Service:** Only handles business logic
- **Hooks:** Only handle React state
- **API Routes:** Only handle HTTP requests/responses
- **UI Components:** Separated into focused components

### DRY (Don't Repeat Yourself):
- Reusable `StatsCard` component
- Shared color schemes via functions
- Common error handling patterns
- Centralized type definitions
- Reusable modal components

## Testing Recommendations

1. **Unit Tests:**
   - Log parsing functions
   - Date validation
   - Statistics calculation
   - Payment detail extraction

2. **Integration Tests:**
   - API route authentication
   - S3 log fetching
   - End-to-end log retrieval

3. **UI Tests:**
   - Search functionality
   - Filter interactions
   - Modal open/close
   - Date picker validation

## Future Enhancements

1. **Export Functionality:** Download logs as CSV/JSON
2. **Advanced Filters:** Date range, amount range, status
3. **Real-time Updates:** WebSocket for live log streaming
4. **Analytics Dashboard:** Charts and graphs for payment trends
5. **Alert System:** Notifications for failed payments
6. **Log Retention:** Automatic archiving of old logs

## Troubleshooting

### Logs not loading:
- Check AWS S3 credentials
- Verify bucket permissions
- Ensure log files exist for selected date

### Authentication errors:
- Clear browser cookies
- Re-login to admin panel
- Check JWT token expiration

### Display issues:
- Clear browser cache
- Check console for JavaScript errors
- Verify all icons are imported correctly
