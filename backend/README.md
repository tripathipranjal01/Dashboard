# Job Tracker Backend API

A robust Node.js backend API for managing job applications with a Kanban-style board interface.

## Features

- 🎯 **Job Management**: Create, read, update, and delete job applications
- 📊 **Status Tracking**: Track jobs through 5 stages (Saved, Applied, Interviewing, Offer, Rejected)
- 🔄 **Drag & Drop Support**: API endpoints optimized for Kanban board interactions
- 📈 **Analytics**: Job statistics and success metrics
- 🔍 **Advanced Filtering**: Filter jobs by status, date, priority, etc.
- 📝 **Interview Tracking**: Manage multiple interview rounds per job
- 🏷️ **Tagging System**: Organize jobs with custom tags
- ⚡ **Performance**: Optimized with MongoDB indexes
- 🛡️ **Security**: Input validation, CORS, and security headers
- 📚 **Documentation**: Built-in API documentation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Express Validator
- **Security**: Helmet, CORS
- **Logging**: Morgan
- **Environment**: dotenv

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Clone and setup**:
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your MongoDB connection string:
   ```env
   MONGO_URI=mongodb://localhost:27017/job-tracker
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

3. **Start the server**:
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

4. **Verify installation**:
   - Health check: http://localhost:5000/health
   - API docs: http://localhost:5000/api/docs

## API Endpoints

### Jobs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/jobs/:userId` | Get all jobs for user (grouped by status) |
| `GET` | `/api/jobs/:userId/stats` | Get job statistics |
| `GET` | `/api/jobs/job/:jobId` | Get single job by ID |
| `POST` | `/api/jobs` | Create new job |
| `PUT` | `/api/jobs/:jobId` | Update job details |
| `PATCH` | `/api/jobs/:jobId/status` | Update job status (drag & drop) |
| `DELETE` | `/api/jobs/:jobId` | Delete job |
| `PATCH` | `/api/jobs/bulk` | Bulk update jobs |
| `POST` | `/api/jobs/:jobId/interviews` | Add interview to job |

### Query Parameters

- `grouped=true/false` - Return grouped or flat job list
- `status=Saved|Applied|Interviewing|Offer|Rejected` - Filter by status
- `limit=10` - Limit results
- `page=1` - Pagination

## Data Models

### Job Schema

```javascript
{
  userId: String,           // Required
  jobTitle: String,         // Required
  company: String,          // Required
  status: String,           // Enum: Saved, Applied, Interviewing, Offer, Rejected
  jobLink: String,          // URL validation
  notes: String,            // Max 1000 chars
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
    type: String,           // Enum: Phone, Video, In-Person, Technical, HR, Final
    notes: String
  }],
  tags: [String],
  priority: String,         // Enum: Low, Medium, High
  createdAt: Date,
  updatedAt: Date
}
```

## Usage Examples

### Create a Job

```javascript
POST /api/jobs
Content-Type: application/json

{
  "userId": "user123",
  "jobTitle": "Senior Software Engineer",
  "company": "Tech Corp",
  "status": "Saved",
  "jobLink": "https://techcorp.com/careers/senior-engineer",
  "notes": "Great company culture, remote-friendly",
  "salary": "$120,000 - $160,000",
  "location": "San Francisco, CA",
  "priority": "High",
  "tags": ["remote", "javascript", "react"]
}
```

### Update Job Status (Drag & Drop)

```javascript
PATCH /api/jobs/60f7b3b3b3b3b3b3b3b3b3b3/status
Content-Type: application/json

{
  "status": "Applied"
}
```

### Get Jobs Grouped by Status

```javascript
GET /api/jobs/user123?grouped=true

Response:
{
  "success": true,
  "data": {
    "Saved": [...],
    "Applied": [...],
    "Interviewing": [...],
    "Offer": [...],
    "Rejected": [...]
  }
}
```

### Add Interview

```javascript
POST /api/jobs/60f7b3b3b3b3b3b3b3b3b3b3/interviews
Content-Type: application/json

{
  "round": "Technical Interview",
  "date": "2024-01-15T10:00:00Z",
  "type": "Video",
  "notes": "Focus on React and system design"
}
```

## Frontend Integration

### React Hook Example

```javascript
// Custom hook for job management
const useJobs = (userId) => {
  const [jobs, setJobs] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      const response = await fetch(`/api/jobs/${userId}?grouped=true`);
      const data = await response.json();
      setJobs(data.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update job status (for drag & drop)
  const updateJobStatus = async (jobId, newStatus) => {
    try {
      await fetch(`/api/jobs/${jobId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchJobs(); // Refresh data
    } catch (error) {
      console.error('Error updating job status:', error);
    }
  };

  return { jobs, loading, fetchJobs, updateJobStatus };
};
```

## Error Handling

The API returns consistent error responses:

```javascript
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "jobTitle",
      "message": "Job title is required"
    }
  ]
}
```

## Security Features

- **Input Validation**: All inputs validated with express-validator
- **CORS**: Configured for frontend domains
- **Helmet**: Security headers
- **Rate Limiting**: Can be added for production
- **Data Sanitization**: Mongoose schema validation

## Performance Optimizations

- **Database Indexes**: Optimized queries for userId and status
- **Pagination**: Built-in pagination support
- **Aggregation**: Efficient statistics calculation
- **Connection Pooling**: MongoDB connection optimization

## Deployment

### Environment Variables for Production

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/job-tracker
PORT=5000
FRONTEND_URL=https://your-frontend-domain.com
```

### Docker Support (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## Monitoring & Logging

- **Health Check**: `/health` endpoint for monitoring
- **Request Logging**: Morgan middleware
- **Error Tracking**: Comprehensive error handling
- **Performance Metrics**: Can integrate with monitoring tools

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details