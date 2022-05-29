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

  const company = await prisma.company.create({
    data: {
      name: 'New Company',
      tenantId: tenantId,
      validUntil: new Date(),
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

  const building01 = await prisma.building.create({
    data: { displayName: 'Building 01', tenantId: tenantId },
  });
  const building02 = await prisma.building.create({
    data: { displayName: 'Building 02', tenantId: tenantId },
  });

  const employees = await prisma.employee.createMany({
    data: [
      {
        firstName: 'Peter',
        lastName: 'Miller',
        alias: '🐰 Pete',
        companyId: company.uuid,
        tenantId: tenantId,
      },
      {
        firstName: 'Jane',
        lastName: 'Doe',
        alias: '🐝 Jane',
        companyId: company.uuid,
        tenantId: tenantId,
      },
    ],
  });

  const allEmployees = await prisma.employee.findMany({ where: { tenantId } });

  const contracts = await prisma.contract.createMany({
    data: allEmployees.map((e) => ({
      employeeId: e.uuid,
      bgColor: 'blue',
      tenantId: tenantId,
    })),
  });

  const rooms = await prisma.room.createMany({
    data: [
      {
        displayName: '01',
        description: 'Room 01',
        buildingId: building01.uuid,
        tenantId: tenantId,
      },
      {
        displayName: '02',
        description: 'Room 02',
        buildingId: building02.uuid,
        tenantId: tenantId,
      },
    ],
  });

  const teams = await prisma.team.createMany({
    data: [
      {
        companyId: company.uuid,
        displayName: 'Team 01',
        tenantId,
      },
      {
        companyId: company.uuid,
        displayName: 'Team 02',
        tenantId,
      },
    ],
  });

  const permissionLevels = await prisma.permissionLevel.createMany({
    data: [
      {
        displayName: 'admin',
        description: 'admin role',
        tenantId
      },
      {
        displayName: 'employee',
        description: 'employee role',
        tenantId
      },
      {
        displayName: 'planer',
        description: 'planer role',
        tenantId
      },
    ]
  })
  // results
  console.log({
    tenant,
    appSettings,
    building01,
    building02,
    rooms,
    employees,
    contracts,
    teams,
    permissionLevels
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
