import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
prisma
  .$connect()
  .then(() => console.log('✅ DB connected!'))
  .catch((error) => console.log('❌ DB connection failed:', error));

export default prisma;
