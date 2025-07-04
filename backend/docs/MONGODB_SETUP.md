# Complete MongoDB Setup Guide for Job Tracker

This guide provides step-by-step instructions for setting up MongoDB for your Job Tracker application. You can choose between local MongoDB installation or MongoDB Atlas (cloud).

## Table of Contents

1. [Option 1: MongoDB Atlas (Cloud) - Recommended](#option-1-mongodb-atlas-cloud---recommended)
2. [Option 2: Local MongoDB Installation](#option-2-local-mongodb-installation)
3. [Database Configuration](#database-configuration)
4. [Testing the Connection](#testing-the-connection)
5. [Database Schema Setup](#database-schema-setup)
6. [Troubleshooting](#troubleshooting)

---

## Option 1: MongoDB Atlas (Cloud) - Recommended

MongoDB Atlas is the easiest way to get started. It's free for small projects and handles all the infrastructure for you.

### Step 1: Create MongoDB Atlas Account

1. **Go to MongoDB Atlas**: Visit [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)

2. **Sign Up**: Click "Try Free" and create an account with:
   - Email address
   - Password
   - First/Last name

3. **Verify Email**: Check your email and verify your account

### Step 2: Create a New Cluster

1. **Create Organization** (if prompted):
   - Organization Name: `Job Tracker`
   - Click "Next"

2. **Create Project**:
   - Project Name: `Job Tracker Backend`
   - Click "Next"

3. **Choose Deployment Option**:
   - Select "M0 Sandbox" (Free tier)
   - Provider: AWS (recommended)
   - Region: Choose closest to your location
   - Cluster Name: `job-tracker-cluster`
   - Click "Create"

### Step 3: Configure Database Access

1. **Create Database User**:
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Authentication Method: Password
   - Username: `jobtracker-admin`
   - Password: Generate a secure password (save this!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

### Step 4: Configure Network Access

1. **Add IP Address**:
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add your specific IP addresses
   - Click "Confirm"

### Step 5: Get Connection String

1. **Connect to Cluster**:
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Driver: Node.js
   - Version: 4.1 or later
   - Copy the connection string

2. **Connection String Format**:
   ```
   mongodb+srv://jobtracker-admin:<password>@job-tracker-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

3. **Replace `<password>`** with your actual password

### Step 6: Update Environment Variables

1. **Edit your `.env` file**:
   ```env
   # MongoDB Atlas Connection
   MONGO_URI=mongodb+srv://jobtracker-admin:YOUR_PASSWORD@job-tracker-cluster.xxxxx.mongodb.net/job-tracker?retryWrites=true&w=majority
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

2. **Important**: Replace `YOUR_PASSWORD` with your actual database user password

---

## Option 2: Local MongoDB Installation

If you prefer to run MongoDB locally on your machine:

### Step 1: Install MongoDB Community Edition

#### For Windows:

1. **Download MongoDB**:
   - Go to [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Select Windows
   - Download the MSI installer

2. **Install MongoDB**:
   - Run the MSI installer
   - Choose "Complete" installation
   - Install as a Windows Service
   - Install MongoDB Compass (GUI tool)

3. **Verify Installation**:
   ```cmd
   mongod --version
   ```

#### For macOS:

1. **Using Homebrew** (recommended):
   ```bash
   # Install Homebrew if you don't have it
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   
   # Install MongoDB
   brew tap mongodb/brew
   brew install mongodb-community
   ```

2. **Start MongoDB**:
   ```bash
   # Start MongoDB service
   brew services start mongodb/brew/mongodb-community
   
   # Or run manually
   mongod --config /usr/local/etc/mongod.conf
   ```

3. **Verify Installation**:
   ```bash
   mongod --version
   mongo --version
   ```

#### For Linux (Ubuntu/Debian):

1. **Import MongoDB GPG Key**:
   ```bash
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   ```

2. **Add MongoDB Repository**:
   ```bash
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   ```

3. **Install MongoDB**:
   ```bash
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```

4. **Start MongoDB**:
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

5. **Verify Installation**:
   ```bash
   mongod --version
   ```

### Step 2: Configure Local MongoDB

1. **Create Database Directory** (if needed):
   ```bash
   # Windows
   mkdir C:\data\db
   
   # macOS/Linux
   sudo mkdir -p /data/db
   sudo chown -R $USER /data/db
   ```

2. **Start MongoDB** (if not running as service):
   ```bash
   mongod
   ```

3. **Update Environment Variables**:
   ```env
   # Local MongoDB Connection
   MONGO_URI=mongodb://localhost:27017/job-tracker
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

---

## Database Configuration

### Step 1: Install MongoDB Tools (Optional)

1. **MongoDB Compass** (GUI):
   - Download from [MongoDB Compass](https://www.mongodb.com/products/compass)
   - Great for visualizing your data

2. **MongoDB Shell** (mongosh):
   ```bash
   npm install -g mongosh
   ```

### Step 2: Create Database and Collections

Your Node.js application will automatically create the database and collections, but you can also do it manually:

1. **Connect to MongoDB**:
   ```bash
   # For Atlas
   mongosh "mongodb+srv://jobtracker-admin:PASSWORD@job-tracker-cluster.xxxxx.mongodb.net/"
   
   # For Local
   mongosh
   ```

2. **Create Database**:
   ```javascript
   use job-tracker
   ```

3. **Create Collections** (optional - Mongoose will do this):
   ```javascript
   db.createCollection("jobs")
   ```

---

## Testing the Connection

### Step 1: Test with Node.js Application

1. **Start your backend server**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Check console output**:
   ```
   ✅ MongoDB Connected: job-tracker-cluster.xxxxx.mongodb.net
   🚀 Server running on port 5000 in development mode
   ```

3. **Test health endpoint**:
   ```bash
   curl http://localhost:5000/health
   ```

### Step 2: Test Database Operations

1. **Create a test job**:
   ```bash
   curl -X POST http://localhost:5000/api/jobs \
     -H "Content-Type: application/json" \
     -d '{
       "userId": "test-user",
       "jobTitle": "Test Engineer",
       "company": "Test Company",
       "status": "Saved"
     }'
   ```

2. **Retrieve jobs**:
   ```bash
   curl http://localhost:5000/api/jobs/test-user
   ```

### Step 3: Verify in MongoDB Compass

1. **Open MongoDB Compass**
2. **Connect using your connection string**
3. **Navigate to**: `job-tracker` → `jobs`
4. **You should see your test job**

---

## Database Schema Setup

Your application will automatically create the proper schema, but here's what gets created:

### Jobs Collection Schema

```javascript
{
  _id: ObjectId,
  userId: String,
  jobTitle: String,
  company: String,
  status: String, // "Saved", "Applied", "Interviewing", "Offer", "Rejected"
  jobLink: String,
  notes: String,
  salary: String,
  location: String,
  applicationDate: Date,
  deadline: Date,
  contactPerson: {
    name: String,
    email: String,
    phone: String
  },
  interviewDates: [{
    round: String,
    date: Date,
    type: String,
    notes: String
  }],
  tags: [String],
  priority: String, // "Low", "Medium", "High"
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes Created Automatically

```javascript
// Performance indexes
{ userId: 1, status: 1 }
{ userId: 1, createdAt: -1 }
{ userId: 1, applicationDate: -1 }
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Connection Timeout

**Problem**: `MongooseServerSelectionError: connection timed out`

**Solutions**:
- Check your internet connection
- Verify IP address is whitelisted in Atlas
- Check firewall settings
- Verify connection string is correct

#### 2. Authentication Failed

**Problem**: `MongooseServerSelectionError: bad auth`

**Solutions**:
- Verify username and password in connection string
- Check database user permissions
- Ensure password doesn't contain special characters (URL encode if needed)

#### 3. Database Not Found

**Problem**: Database or collection doesn't exist

**Solutions**:
- MongoDB creates databases/collections automatically on first write
- Try creating a test document
- Check database name in connection string

#### 4. Local MongoDB Won't Start

**Problem**: `mongod` command fails

**Solutions**:
```bash
# Check if MongoDB is already running
ps aux | grep mongod

# Kill existing processes
sudo pkill mongod

# Start with specific config
mongod --config /usr/local/etc/mongod.conf

# Check logs
tail -f /usr/local/var/log/mongodb/mongo.log
```

#### 5. Port Already in Use

**Problem**: Port 27017 is busy

**Solutions**:
```bash
# Find process using port
lsof -i :27017

# Kill the process
kill -9 <PID>

# Or use different port
mongod --port 27018
```

### Environment Variable Issues

1. **Check .env file location**: Must be in `/backend` directory
2. **Verify .env is loaded**: Add `console.log(process.env.MONGO_URI)` in your code
3. **No spaces around =**: `MONGO_URI=mongodb://...` (not `MONGO_URI = mongodb://...`)

### Connection String Format

#### Atlas Connection String:
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

#### Local Connection String:
```
mongodb://localhost:27017/job-tracker
```

#### With Authentication (local):
```
mongodb://username:password@localhost:27017/job-tracker
```

---

## Security Best Practices

### For Production:

1. **Use Strong Passwords**:
   - Minimum 12 characters
   - Mix of letters, numbers, symbols

2. **Restrict IP Access**:
   - Don't use 0.0.0.0/0 in production
   - Add only necessary IP addresses

3. **Use Environment Variables**:
   - Never commit credentials to git
   - Use different credentials for different environments

4. **Enable Authentication**:
   ```javascript
   // In production, always use authentication
   mongodb://username:password@host:port/database
   ```

5. **Use SSL/TLS**:
   ```javascript
   // Atlas uses SSL by default
   // For local production, enable SSL
   ```

---

## Next Steps

After setting up MongoDB:

1. **Start your backend server**: `npm run dev`
2. **Test all API endpoints**: Use Postman or curl
3. **Connect your frontend**: Update frontend API calls
4. **Monitor performance**: Use MongoDB Compass or Atlas monitoring
5. **Set up backups**: Configure automated backups in Atlas

---

## Support

If you encounter issues:

1. **Check MongoDB Atlas Status**: [status.mongodb.com](https://status.mongodb.com)
2. **MongoDB Documentation**: [docs.mongodb.com](https://docs.mongodb.com)
3. **Community Forums**: [community.mongodb.com](https://community.mongodb.com)
4. **Stack Overflow**: Tag your questions with `mongodb` and `mongoose`

---

## Summary

You now have a complete MongoDB setup for your Job Tracker application! The database will:

- ✅ Store all job applications persistently
- ✅ Support the Kanban board functionality
- ✅ Provide fast queries with proper indexing
- ✅ Scale as your application grows
- ✅ Maintain data integrity with validation

Your job tracker will now persist data across page refreshes and provide a robust foundation for your application.