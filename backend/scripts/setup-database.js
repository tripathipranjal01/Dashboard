const mongoose = require('mongoose');
require('dotenv').config();

const Job = require('../models/Job');

// Sample data for testing
const sampleJobs = [
  {
    userId: 'demo-user',
    jobTitle: 'Senior Software Engineer',
    company: 'TechCorp Inc',
    status: 'Applied',
    jobLink: 'https://techcorp.com/careers/senior-engineer',
    notes: 'Great company culture, remote-friendly position',
    salary: '$120,000 - $160,000',
    location: 'San Francisco, CA',
    priority: 'High',
    tags: ['remote', 'javascript', 'react'],
    applicationDate: new Date('2024-01-10')
  },
  {
    userId: 'demo-user',
    jobTitle: 'Frontend Developer',
    company: 'StartupXYZ',
    status: 'Interviewing',
    jobLink: 'https://startupxyz.com/jobs/frontend',
    notes: 'Exciting startup with growth potential',
    salary: '$90,000 - $120,000',
    location: 'Remote',
    priority: 'Medium',
    tags: ['startup', 'vue', 'typescript'],
    applicationDate: new Date('2024-01-05'),
    interviewDates: [{
      round: 'Technical Interview',
      date: new Date('2024-01-20'),
      type: 'Video',
      notes: 'Focus on Vue.js and component architecture'
    }]
  },
  {
    userId: 'demo-user',
    jobTitle: 'Full Stack Developer',
    company: 'Enterprise Solutions',
    status: 'Saved',
    jobLink: 'https://enterprise.com/careers/fullstack',
    notes: 'Large enterprise company, good benefits',
    salary: '$100,000 - $140,000',
    location: 'New York, NY',
    priority: 'Medium',
    tags: ['enterprise', 'node.js', 'mongodb']
  },
  {
    userId: 'demo-user',
    jobTitle: 'React Developer',
    company: 'Digital Agency',
    status: 'Rejected',
    jobLink: 'https://digitalagency.com/jobs/react',
    notes: 'Position filled internally',
    salary: '$80,000 - $110,000',
    location: 'Austin, TX',
    priority: 'Low',
    tags: ['agency', 'react', 'design'],
    applicationDate: new Date('2023-12-15')
  },
  {
    userId: 'demo-user',
    jobTitle: 'Lead Software Engineer',
    company: 'Innovation Labs',
    status: 'Offer',
    jobLink: 'https://innovationlabs.com/careers/lead-engineer',
    notes: 'Received offer! Negotiating salary',
    salary: '$150,000 - $180,000',
    location: 'Seattle, WA',
    priority: 'High',
    tags: ['leadership', 'python', 'ai'],
    applicationDate: new Date('2024-01-01')
  }
];

async function setupDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Clear existing data (optional)
    console.log('🧹 Clearing existing jobs...');
    await Job.deleteMany({ userId: 'demo-user' });
    
    // Insert sample data
    console.log('📝 Inserting sample jobs...');
    const insertedJobs = await Job.insertMany(sampleJobs);
    
    console.log(`✅ Successfully inserted ${insertedJobs.length} sample jobs`);
    
    // Display statistics
    const stats = await Job.getJobStats('demo-user');
    console.log('📊 Job Statistics:');
    console.log(`   Total: ${stats.total}`);
    console.log(`   Saved: ${stats.Saved}`);
    console.log(`   Applied: ${stats.Applied}`);
    console.log(`   Interviewing: ${stats.Interviewing}`);
    console.log(`   Offer: ${stats.Offer}`);
    console.log(`   Rejected: ${stats.Rejected}`);
    
    // Test grouping functionality
    console.log('\n🔍 Testing grouped jobs functionality...');
    const groupedJobs = await Job.getJobsByUserGrouped('demo-user');
    
    Object.entries(groupedJobs).forEach(([status, jobs]) => {
      console.log(`   ${status}: ${jobs.length} jobs`);
    });
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📚 You can now:');
    console.log('   1. Start your server: npm run dev');
    console.log('   2. Test API endpoints: http://localhost:5000/api/docs');
    console.log('   3. View health check: http://localhost:5000/health');
    console.log('   4. Get demo jobs: http://localhost:5000/api/jobs/demo-user');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔒 Database connection closed');
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;