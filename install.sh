#!/bin/bash

echo "🚀 Setting up The Prime Time - Coding Analytics Platform"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed. Please install PostgreSQL and create a database."
    echo "   You can skip this for now and set up the database later."
fi

# Install Backend dependencies
echo "📦 Installing Backend dependencies..."
cd Backend
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
DATABASE_URL="postgresql://username:password@localhost:5432/primetime"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
FRONTEND_URL="http://localhost:5173"
PORT=3000
EOF
    echo "⚠️  Please update the .env file with your actual database credentials"
fi

cd ..

# Install Frontend dependencies
echo "📦 Installing Frontend dependencies..."
cd Frontend
npm install
cd ..

# Install Extension dependencies
echo "📦 Installing Extension dependencies..."
cd Extension
npm install
cd ..

# Generate Prisma client
echo "🔧 Setting up database..."
cd Backend
npx prisma generate
echo "⚠️  Please run 'npx prisma db push' after setting up your database"
cd ..

echo ""
echo "✅ Installation completed!"
echo ""
echo "📋 Next steps:"
echo "1. Set up your PostgreSQL database"
echo "2. Update the .env file in the Backend directory with your database credentials"
echo "3. Run 'cd Backend && npx prisma db push' to create database tables"
echo "4. Start the backend: 'cd Backend && npm run dev'"
echo "5. Start the frontend: 'cd Frontend && npm run dev'"
echo "6. Build the extension: 'cd Extension && npm run compile'"
echo ""
echo "🌐 Backend will run on: http://localhost:3000"
echo "🎨 Frontend will run on: http://localhost:5173"
echo ""
echo "📚 For detailed instructions, see the README.md file" 