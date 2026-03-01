import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient()

export const connectDB = async () => {
    try {
        await prisma.$connect()
        console.log('Connected to database')
    } catch (error) {
        console.log('Error connecting to database', error.message)
    }
}

export default prisma
