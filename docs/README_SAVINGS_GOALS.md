# Database Migration: Savings Goals

## Overview

This migration adds support for monthly savings goals to help users track their savings progress.

## What's Added

- **savings_goals table**: Stores user savings goal history
  - `id`: UUID primary key
  - `user_id`: Reference to auth.users
  - `monthly_goal`: The target savings amount per month
  - `created_at`: Timestamp for tracking goal history

## How to Apply

Run this SQL in your Supabase SQL Editor or apply via migration:

```bash
# If using Supabase CLI
supabase db push

# Or manually execute the SQL file in Supabase Dashboard > SQL Editor
```

## Security

- Row Level Security (RLS) is enabled
- Users can only view/insert/update their own savings goals
- Automatic user_id association via auth.uid()

## Usage

The app will automatically:

1. Fetch the latest savings goal on login
2. Calculate actual savings: `income - total_expenses - fixed_expenses`
3. Show progress percentage and on-track status
4. Allow users to update their goal from the Profile page
