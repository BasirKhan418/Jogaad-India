import mongoose from 'mongoose';

const ConnectDb = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        
        if (!mongoUri) {
            throw new Error('MONGO_URI environment variable is required');
        }
        
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Database connection error:', error);
        throw error; // Propagate the error to handle it in the server startup
    }
};

export default ConnectDb;