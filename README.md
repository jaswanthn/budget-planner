# Budget Planning App

A modern, feature-rich budget planning application built with React, TypeScript, and Supabase.

## 🌟 Features

- **Income Management** - Set and track monthly income
- **Bucket-based Budgeting** - Organize expenses into customizable buckets
- **Transaction Tracking** - Record and categorize all expenses and income
- **Recurring Expenses** - Manage fixed monthly costs
- **Monthly Savings Goal** - Set targets and track progress toward savings goals
- **Real-time Calculations** - Automatic budget calculations and progress tracking
- **Beautiful UI** - Modern, responsive design with Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository

```bash
git clone <your-repo-url>
cd budget-planner
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables
   Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run database migrations

- Go to your Supabase Dashboard
- Navigate to SQL Editor
- Execute the migration files in `supabase/migrations/` in order

5. Start the development server

```bash
npm run dev
```

## 📚 Documentation

All documentation, testing guides, and migration instructions are located in the **[`docs/`](./docs/)** folder:

- **[Main Documentation Index](./docs/README.md)** - Overview and navigation
- **[Savings Goal Testing Guide](./docs/TESTING_SAVINGS_GOAL.md)** - How to test the savings goal feature
- **[Savings Goal Migration](./docs/README_SAVINGS_GOALS.md)** - Database setup for savings goals

## 🏗️ Project Structure

```
budget-planner/
├── docs/                          # 📚 Documentation & guides
├── src/
│   ├── api/                       # API layer (Supabase)
│   ├── components/                # React components
│   │   ├── profile/              # Profile page components
│   │   ├── transactions/         # Transaction components
│   │   └── ui/                   # Reusable UI components
│   ├── data/                      # State management
│   ├── pages/                     # Page components
│   ├── types/                     # TypeScript type definitions
│   └── lib/                       # Utilities and config
├── supabase/
│   └── migrations/                # Database migrations
└── public/                        # Static assets
```

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: Custom React hooks
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Build Tool**: Vite
- **Routing**: React Router v7

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- User-specific data isolation
- Secure authentication via Supabase Auth

## 📊 Key Features Explained

### Monthly Savings Goal

Track your progress toward monthly savings targets with:

- Visual progress bar
- Real-time calculations
- On-track status indicators
- Formula: `Savings = Income - Expenses - Fixed Costs`

### Bucket-based Budgeting

Organize your spending into categories:

- Set limits for each bucket
- Track spending per bucket
- Visual progress indicators

## 🧪 Testing

Refer to the testing guides in the [`docs/`](./docs/) folder for comprehensive testing instructions for each feature.

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

This is a personal project. Contributions are not currently accepted.

---

**Need help?** Check the [documentation](./docs/README.md) or review the testing guides in the `docs/` folder.
