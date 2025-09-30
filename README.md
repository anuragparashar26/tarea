# Tarea - Organize Smarter

A minimal and elegant workspace for managing your notes and tasks. Built with Next.js, TypeScript, and modern web technologies.

<br>
<div align="center">
  <img src="public/logowithtext.png" alt="Tarea Logo" width="200" height="200">
</div>

## Features

### 📝 Notes Management

- Create, edit, and organize notes with rich text content
- Color-coded notes for easy categorization
- Pin important notes to the top
- Archive notes you don't need immediately
- Drag and drop to reorder notes

### ✅ Task Management

- Create tasks with descriptions, priorities, and due dates
- Organize tasks into custom lists
- Set reminders for important deadlines
- Mark tasks as "My Day" for daily focus
- Priority levels: Low, Medium, High, Urgent
- Drag and drop to reorder tasks within lists

### 🔐 Authentication

- Secure user authentication with NextAuth
- Support for multiple OAuth providers
- Password-based authentication
- User profile management

### 🎨 Modern UI/UX

- Clean, minimal design with dark mode support
- Responsive layout for all devices
- Smooth animations with Framer Motion
- Accessible components with Radix UI
- Drag and drop functionality with @dnd-kit

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI, Lucide Icons
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **State Management**: TanStack Query (React Query)
- **Validation**: Zod
- **Animations**: Framer Motion
- **Drag & Drop**: @dnd-kit

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/anuragparashar26/tarea.git
cd tarea
```

2. Install dependencies:

```bash
npm install
```

3. Set up your environment variables. Create a `.env.local` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/tarea"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

4. Set up the database:

```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Available Scripts

- `npm run dev` - Start the development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code linting

## Database Schema

The application uses Prisma with PostgreSQL. Key models include:

- **User**: User accounts and authentication
- **Note**: User notes with content, colors, and metadata
- **TaskList**: Collections of tasks
- **Task**: Individual tasks with priorities, due dates, and status

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   └── profile/           # User profile
├── components/            # Reusable UI components
│   ├── notes/            # Notes-related components
│   ├── tasks/            # Tasks-related components
│   └── ui/               # Base UI components
├── hooks/                # Custom React hooks
└── lib/                  # Utility functions and configurations
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

## License

This project is private and proprietary.

## Support

For support or questions, please contact the developer.
