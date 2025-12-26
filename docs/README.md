# Budget Planner Documentation

Welcome to the Budget Planner documentation! This folder contains all testing guides, migration instructions, and feature documentation.

## 📚 Documentation Index

### Features & Testing

- **[Savings Goal Feature Testing](./TESTING_SAVINGS_GOAL.md)** - Complete guide for testing the monthly savings goal feature

### Database Migrations

- **[Savings Goals Migration](./README_SAVINGS_GOALS.md)** - Instructions for setting up the savings_goals database table

## 🚀 Quick Start

### Running the App

```bash
npm run dev
```

### Setting Up Database

1. Review the migration files in `supabase/migrations/`
2. Follow the instructions in the respective README files
3. Execute SQL in your Supabase Dashboard

## 📖 Feature Documentation

### Monthly Savings Goal

The savings goal feature helps users track their progress toward monthly savings targets.

**Key Features:**

- Set monthly savings target
- Real-time calculation: `Income - Expenses - Fixed Costs`
- Visual progress bar
- On-track status indicators

**Location:** Profile Page → Monthly Savings Goal Section

**Files:**

- Component: `src/components/profile/SavingsGoalSection.tsx`
- API: `src/api/savingsGoal.api.ts`
- Migration: `supabase/migrations/004_create_savings_goals.sql`

## 🧪 Testing

All testing guides are located in this `docs/` folder. Each feature has its own testing document with:

- Prerequisites
- Step-by-step testing instructions
- Expected behavior
- Troubleshooting tips

## 📁 Project Structure

```
budget-planner/
├── docs/                          # Documentation (you are here)
│   ├── README.md                  # This file
│   ├── TESTING_SAVINGS_GOAL.md    # Savings goal testing guide
│   └── README_SAVINGS_GOALS.md    # Savings goal migration guide
├── src/
│   ├── api/                       # API layer
│   ├── components/                # React components
│   ├── data/                      # State management
│   ├── pages/                     # Page components
│   └── types/                     # TypeScript types
└── supabase/
    └── migrations/                # Database migrations
```

## 🆘 Need Help?

If you encounter issues:

1. Check the relevant testing guide in this folder
2. Review the browser console for errors (F12)
3. Check the terminal output for build errors
4. Verify Supabase connection and migrations

## 🔄 Recent Updates

### 2025-12-26

- ✅ Added Monthly Savings Goal feature
- ✅ Created comprehensive testing documentation
- ✅ Organized all docs into `/docs` folder
