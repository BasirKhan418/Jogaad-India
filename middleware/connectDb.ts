import mongoose from 'mongoose';

// Track connection state
let isConnecting = false;

const ConnectDb = async (): Promise<void> => {
    // Check mongoose readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const readyState = mongoose.connection.readyState;
    
    // Return if already connected
    if (readyState === 1) {
        return;
    }
    
    // Wait for ongoing connection if currently connecting
    if (readyState === 2 || isConnecting) {
        await waitForConnection();
        return;
    }
    
    try {
        const mongoUri = process.env.MONGO_URI;
        
        if (!mongoUri) {
            throw new Error('MONGO_URI environment variable is required');
        }
        
        isConnecting = true;
        
        // Optimal connection configuration for production
        const connectionOptions = {
            bufferCommands: false,
            maxPoolSize: 10, // Maximum connections in the pool
            minPoolSize: 2,  // Minimum connections in the pool
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
            maxIdleTimeMS: 30000,
        };
        
        // Only call mongoose.connect if not already connected or connecting
        if (readyState === 0) {
            await mongoose.connect(mongoUri, connectionOptions);
        }
        
        isConnecting = false;
        console.log('MongoDB connected successfully');
    } catch (error) {
        isConnecting = false;
        console.error('Database connection error:', error);
        throw error;
    }
};

// Helper function to wait for ongoing connection
const waitForConnection = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
        const checkInterval = setInterval(() => {
            if (mongoose.connection.readyState === 1) {
                clearInterval(checkInterval);
                resolve();
            } else if (!isConnecting && mongoose.connection.readyState === 0) {
                clearInterval(checkInterval);
                reject(new Error('Connection failed'));
            }
        }, 100);
        
        // Timeout after 10 seconds
        setTimeout(() => {
            clearInterval(checkInterval);
            reject(new Error('Connection timeout'));
        }, 10000);
    });
};

// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (error) => {
    console.error('Mongoose connection error:', error);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
    }
});

export default ConnectDb;