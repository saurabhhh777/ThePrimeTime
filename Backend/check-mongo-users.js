import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Define User schema (simplified)
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

async function checkMongoUsers() {
  try {
    console.log('Checking users in MongoDB...');
    
    const users = await User.find({}).select('username email');
    console.log(`Found ${users.length} users in MongoDB:`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. Username: ${user.username}, Email: ${user.email}`);
    });
    
  } catch (error) {
    console.error('Error checking MongoDB users:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkMongoUsers(); 