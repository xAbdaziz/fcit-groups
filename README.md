# FCIT Groups 🎓

A modern web application that helps Faculty of Computing and Information Technology (FCIT) students find and join WhatsApp groups for their courses, ensuring they never miss important updates and can connect with their classmates.

## ✨ Features

- **Course Search**: Find WhatsApp groups by course code (CPIS, CPCS, CPIT, STAT, MATH, BUS, MRKT, ACCT) and course number
- **Group Management**: Add new groups to help other students in your courses
- **Gender-Specific Groups**: Support for general, male-only, and female-only groups
- **Secure Authentication**: User authentication powered by NextAuth.js
- **Responsive Design**: Beautiful UI built with Mantine components
- **Real-time Updates**: Stay connected with your classmates and course updates

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- A database (PostgreSQL recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/fcit-groups.git
   cd fcit-groups
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Rename `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```
   
   Then edit the `.env` file with your configuration:
   ```env
   # Database
   DATABASE_URL="postgres://YourUserName:YourPassword@YourHostname:5432/YourDatabaseName?schema=public"
   
   # NextAuth.js
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   
   # NextAuth Email Provider
   EMAIL_SERVER="smtp://YourUserName:YourPassword@YourHostname:587"
   EMAIL_FROM="your-email@example.com"
   ```

4. **Set up the database**
   ```bash
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Database**: [Prisma ORM](https://prisma.io/)
- **UI Library**: [Mantine](https://mantine.dev/)
- **Icons**: [Tabler Icons](https://tabler-icons.io/)
- **Styling**: PostCSS with Mantine components
- **Validation**: [Zod](https://zod.dev/)

## 📁 Project Structure

```
src/
├── app/
│   ├── addAGroup/          # Add new WhatsApp groups
│   ├── findAGroup/         # Search and find existing groups
│   ├── api/                # API routes
│   │   ├── addGroup/       # Add group endpoint
│   │   ├── auth/           # NextAuth configuration
│   │   ├── listOfCourses/  # Get available courses
│   │   ├── searchGroup/    # Search groups endpoint
│   │   └── updateGender/   # Update user gender preference
│   └── components/         # Reusable UI components
├── server/
│   ├── auth.ts            # Authentication configuration
│   └── db.ts              # Database connection
└── styles/                # CSS modules and global styles
```

## 🎯 Usage

### Finding a Group

1. Navigate to "Find a Group"
2. Select your course code (e.g., CPIS, CPCS, CPIT)
3. Choose the course number from the available options
4. Browse available WhatsApp groups filtered by section and gender preference
5. Click "Join" to access the WhatsApp group

### Adding a Group

1. Go to "Add a Group"
2. Fill in the course details and WhatsApp group link
3. Specify the section and gender preference
4. Submit to make the group available to other students

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to a Git repository
2. Connect your repository to [Vercel](https://vercel.com/)
3. Configure environment variables in Vercel dashboard
4. Deploy automatically with each push

### Manual Deployment

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## 📚 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server (runs on port 7435)
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Prisma Studio for database management

---

Made with ❤️ for FCIT students
