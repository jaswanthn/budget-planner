# Savings Goal Feature - Testing Guide

## Current Status

✅ App is running on: **http://localhost:5180/**

## What to Test

### 1. Check if App Loads

- Navigate to http://localhost:5180/
- You should see the login/auth page or home page
- **Note**: The app will work even if you haven't created the database table yet

### 2. Navigate to Profile Page

- Click on "Profile" in the navigation
- You should see:
  - Income Section
  - **Monthly Savings Goal Section** (NEW!)
  - Recurring Expenses Section
  - Profile Summary

### 3. Test Savings Goal (Without Database)

If you haven't run the migration yet:

- The savings goal section will show ₹0 as the goal
- You can click "Set Goal" but saving will fail (check browser console)
- This is expected - you need to run the database migration first

### 4. Run Database Migration

To enable full functionality:

1. Go to your Supabase Dashboard
2. Navigate to: **SQL Editor**
3. Copy the contents of: `supabase/migrations/004_create_savings_goals.sql`
4. Paste and execute the SQL
5. Refresh the app

### 5. Test Savings Goal (With Database)

After migration:

- Click "Set Goal" button
- Enter a monthly savings target (e.g., 10000)
- Click "Save"
- You should see:
  - Your target amount
  - Current savings calculation
  - Progress bar
  - Status message (on track or not)

## Troubleshooting

### App Not Loading

1. Check the terminal for errors
2. Make sure port 5180 is accessible
3. Try clearing browser cache and localStorage
4. Check browser console (F12) for errors

### Savings Goal Not Saving

- Check browser console for error messages
- Verify the database migration was run successfully
- Check Supabase logs for any RLS policy issues

### Data Not Showing

- Make sure you're logged in
- Check that you have income and expenses set up
- Verify Supabase connection in browser console

## Expected Behavior

### Savings Calculation

```
Actual Savings = Monthly Income - Total Bucket Spending - Fixed Expenses
```

### Progress Indicator

- **Green** = On track (actual ≥ goal)
- **Orange** = Behind (actual < goal)
- Progress bar shows percentage: (actual / goal) × 100%

## Browser Console Commands

To check current state, open browser console (F12) and run:

```javascript
// Check localStorage
JSON.parse(localStorage.getItem("budget_planner_v1"));

// Check if savings goal is loaded
// (after navigating to profile page)
```
