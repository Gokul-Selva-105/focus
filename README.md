# Personal Development Assistant App

A comprehensive full-stack personal development and productivity application built with Next.js 14, TypeScript, MongoDB, and NextAuth.js.

## Features

### 🎯 Task Management
- Create, update, and delete tasks
- Set priorities and due dates
- Track completion status
- Organize by categories
- Recurring task support

### 💰 Financial Tracking
- Income and expense tracking
- Real-time balance calculation
- Category-based organization
- Transaction history with filtering
- Financial analytics

### 🍽️ Meal & Nutrition Logging
- Log daily meals and nutrition
- Track calories and food items
- Meal time categorization
- Nutritional insights

### 🏃‍♂️ Fitness & Activity Tracking
- Log physical activities
- Track duration and intensity
- Calculate calories burned
- Weekly activity summaries

### 📅 Calendar & Events
- Create and manage events
- Set reminders and notifications
- Recurring event support
- Color-coded categories

### 📊 Analytics Dashboard
- Personal development insights
- Progress tracking
- Visual data representation
- Goal achievement metrics

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **NextAuth.js** - Authentication solution
- **bcryptjs** - Password hashing

### UI Components
- **ShadCN UI** - Modern component library
- **Class Variance Authority** - Component variants
- **Tailwind Merge** - Conditional styling
- **React Hook Form** - Form management
- **Zod** - Schema validation

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jarvis
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your values:
   ```env
   MONGODB_URI=mongodb://localhost:27017/self-development-app
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
jarvis/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── dashboard/     # Dashboard statistics
│   │   ├── tasks/         # Task management
│   │   └── transactions/  # Financial transactions
│   ├── auth/              # Authentication pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # UI components
│   ├── auth-provider.tsx # Authentication provider
│   ├── navigation.tsx    # Main navigation
│   └── theme-provider.tsx# Theme provider
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
│   ├── mongodb.ts        # Database connection
│   └── utils.ts          # Helper functions
├── models/               # Mongoose schemas
│   ├── User.ts           # User model
│   ├── Task.ts           # Task model
│   ├── Transaction.ts    # Transaction model
│   ├── Meal.ts           # Meal model
│   ├── Activity.ts       # Activity model
│   └── Event.ts          # Event model
└── ...
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/session` - Get current session

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Tasks
- `GET /api/tasks` - Get user tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/[id]` - Get specific task
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

### Transactions
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Create new transaction

## Database Models

### User
- Personal information and authentication
- Role-based access control
- Profile settings

### Task
- Task management with priorities
- Due dates and recurring options
- Category organization

### Transaction
- Income and expense tracking
- Category-based organization
- Balance calculations

### Meal
- Nutrition and meal logging
- Calorie tracking
- Food item details

### Activity
- Fitness activity tracking
- Duration and intensity
- Calorie burn calculations

### Event
- Calendar event management
- Reminders and notifications
- Recurring event support

## Features in Development

- [ ] Advanced analytics and reporting
- [ ] Goal setting and tracking
- [ ] Social features and sharing
- [ ] Mobile app (React Native)
- [ ] AI-powered insights
- [ ] Integration with fitness trackers
- [ ] Meal planning and recipes
- [ ] Budget planning tools

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for personal development and productivity**