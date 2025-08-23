import mongoose from "mongoose";
import { PrismaClient } from '@prisma/client';

// MongoDB Connection
export const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            serverSelectionTimeoutMS: 5000
        });
        console.log("✅ MongoDB is connected");
    } catch (error) {
        console.log("❌ MongoDB is not connected:", error.message);
    }
};

// PostgreSQL Connection with Prisma
export const connectPostgreSQL = async () => {
    try {
        const prisma = new PrismaClient();
        await prisma.$connect();
        console.log("✅ PostgreSQL (Prisma) is connected");
        return prisma;
    } catch (error) {
        console.log("❌ PostgreSQL (Prisma) is not connected:", error.message);
        return null;
    }
};

// Hybrid Database Service
export class HybridDBService {
    constructor() {
        this.mongoDB = mongoose;
        this.postgreSQL = null;
    }

    async initialize() {
        // Connect to MongoDB
        await connectMongoDB();
        
        // Connect to PostgreSQL
        this.postgreSQL = await connectPostgreSQL();
        
        console.log("🚀 Hybrid Database Service initialized");
    }

    // MongoDB Operations
    async saveToMongoDB(collection, data) {
        try {
            const model = mongoose.model(collection, new mongoose.Schema({}, { strict: false }));
            const result = await model.create(data);
            return result;
        } catch (error) {
            console.error("MongoDB save error:", error);
            throw error;
        }
    }

    async getFromMongoDB(collection, query = {}) {
        try {
            const model = mongoose.model(collection, new mongoose.Schema({}, { strict: false }));
            const result = await model.find(query);
            return result;
        } catch (error) {
            console.error("MongoDB get error:", error);
            throw error;
        }
    }

    // PostgreSQL Operations (via Prisma)
    async saveToPostgreSQL(model, data) {
        try {
            if (!this.postgreSQL) {
                throw new Error("PostgreSQL not connected");
            }
            
            const result = await this.postgreSQL[model].create({
                data: data
            });
            return result;
        } catch (error) {
            console.error("PostgreSQL save error:", error);
            throw error;
        }
    }

    async getFromPostgreSQL(model, query = {}) {
        try {
            if (!this.postgreSQL) {
                throw new Error("PostgreSQL not connected");
            }
            
            const result = await this.postgreSQL[model].findMany(query);
            return result;
        } catch (error) {
            console.error("PostgreSQL get error:", error);
            throw error;
        }
    }

    // Hybrid Operations - Save to both databases
    async saveToBoth(collection, data, postgreSQLModel) {
        try {
            // Save to MongoDB
            const mongoResult = await this.saveToMongoDB(collection, data);
            
            // Save to PostgreSQL
            const postgresResult = await this.saveToPostgreSQL(postgreSQLModel, data);
            
            return {
                mongoDB: mongoResult,
                postgreSQL: postgresResult
            };
        } catch (error) {
            console.error("Hybrid save error:", error);
            throw error;
        }
    }

    // Get from both databases
    async getFromBoth(collection, mongoQuery = {}, postgreSQLModel, postgresQuery = {}) {
        try {
            // Get from MongoDB
            const mongoResult = await this.getFromMongoDB(collection, mongoQuery);
            
            // Get from PostgreSQL
            const postgresResult = await this.getFromPostgreSQL(postgreSQLModel, postgresQuery);
            
            return {
                mongoDB: mongoResult,
                postgreSQL: postgresResult
            };
        } catch (error) {
            console.error("Hybrid get error:", error);
            throw error;
        }
    }

    // Close connections
    async close() {
        try {
            await mongoose.connection.close();
            if (this.postgreSQL) {
                await this.postgreSQL.$disconnect();
            }
            console.log("🔌 Database connections closed");
        } catch (error) {
            console.error("Error closing connections:", error);
        }
    }
}

// Create and export a singleton instance
export const hybridDB = new HybridDBService(); 