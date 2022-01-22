import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();
const tenantId = process.env.TENANT_UUID;

const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { uuid: tenantId },
    update: {},
    create: {
      uuid: tenantId,
      name: 'New Tenant',
    },
  });

  const appSettings = await prisma.appSettings.upsert({
    where: { tenantId: tenantId },
    update: {},
    create: {
      calDays: "['Mon','Tue','Wed','Thu','Fri']",
      calHoursEnd: 19,
      calHoursStart: 7,
      timescaleWidth: 50,
      tenantId: tenantId,
      companyId: 0,
    },
  });

  console.log({ tenant, appSettings });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
