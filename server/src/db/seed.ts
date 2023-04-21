import { PrismaClient, Patient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { getEncryptedPatient } from '../utils/crypto';
faker.setLocale('de');
const prisma = new PrismaClient();

type NewPatient = Pick<
  Patient,
  | 'firstName'
  | 'lastName'
  | 'isAddpayFreed'
  | 'companyId'
  | 'tenantId'
  | 'street'
  | 'zip'
  | 'city'
>;

async function main() {
  const amountOfPatients = 50;

  const patients: NewPatient[] = [];
  const tenantId = process.env.TENANT_UUID;
  const company = await prisma.company.findFirst();
  const isAddpayFreed = true;
  const companyId = company.uuid;

  for (let i = 0; i < amountOfPatients; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const street = faker.address.streetAddress();
    const zip = faker.address.zipCode('#####');
    const city = faker.address.cityName();

    const patient: NewPatient = {
      firstName,
      lastName,
      street,
      zip,
      city,
      isAddpayFreed,
      companyId,
      tenantId,
    };

    patients.push(getEncryptedPatient(patient));
  }

  const addPatients = async () =>
    await prisma.patient.createMany({ data: patients });

  addPatients();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
