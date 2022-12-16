-- CreateTable
CREATE TABLE "SequelizeMeta" (
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "appSettings" (
    "id" SERIAL NOT NULL,
    "calDays" VARCHAR(255) NOT NULL,
    "calHoursStart" INTEGER NOT NULL,
    "calHoursEnd" INTEGER NOT NULL,
    "timescaleWidth" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,
    "tenantId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "uuid" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "name2" VARCHAR(255) NOT NULL DEFAULT '',
    "street" VARCHAR(64) DEFAULT '',
    "zip" VARCHAR(10) DEFAULT '',
    "city" VARCHAR(64) DEFAULT '',
    "tenantId" UUID NOT NULL,
    "validUntil" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "buildings" (
    "uuid" UUID NOT NULL,
    "displayName" VARCHAR(64) NOT NULL,
    "description" VARCHAR(64),
    "street" VARCHAR(64),
    "zip" VARCHAR(10),
    "city" VARCHAR(64),
    "tenantId" UUID NOT NULL,

    CONSTRAINT "buildings_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "rooms" (
    "uuid" UUID NOT NULL,
    "displayName" VARCHAR(64) NOT NULL,
    "description" VARCHAR(64),
    "tenantId" UUID NOT NULL,
    "buildingId" UUID NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "employees" (
    "uuid" UUID NOT NULL,
    "firstName" VARCHAR(64),
    "lastName" VARCHAR(64),
    "alias" VARCHAR(64),
    "street" VARCHAR(64),
    "zip" VARCHAR(10),
    "city" VARCHAR(64),
    "birthday" DATE,
    "validUntil" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" UUID NOT NULL,
    "tenantId" UUID NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "employeeTeams" (
    "teamId" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "tenantId" UUID NOT NULL,

    CONSTRAINT "employeeTeams_pkey" PRIMARY KEY ("employeeId","teamId")
);

-- CreateTable
CREATE TABLE "teams" (
    "uuid" UUID NOT NULL,
    "displayName" VARCHAR(64) NOT NULL,
    "description" VARCHAR(64),
    "tenantId" UUID NOT NULL,
    "companyId" UUID NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "contracts" (
    "id" SERIAL NOT NULL,
    "employeeId" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "hoursPerWeek" INTEGER,
    "appointmentsPerWeek" INTEGER,
    "bgColor" VARCHAR(64),
    "validUntil" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "roomId" UUID,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "uuid" UUID NOT NULL,
    "userId" UUID,
    "ressourceId" UUID,
    "title" VARCHAR,
    "type" VARCHAR,
    "leaveStatus" VARCHAR(64) DEFAULT '',
    "leaveType" VARCHAR(64) DEFAULT '',
    "isDiagnostic" BOOLEAN NOT NULL DEFAULT false,
    "isHomeVisit" BOOLEAN,
    "isDone" BOOLEAN DEFAULT false,
    "isDeleted" BOOLEAN DEFAULT false,
    "isAllDay" BOOLEAN,
    "isRecurring" BOOLEAN,
    "isCancelled" BOOLEAN,
    "cancellationReasonId" VARCHAR(10),
    "isCancelledReason" VARCHAR,
    "rrule" VARCHAR,
    "startTime" TIMESTAMP(6),
    "endTime" TIMESTAMP(6),
    "bgColor" VARCHAR,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" UUID,
    "patientId" UUID,
    "roomId" UUID,
    "parentEventId" UUID,

    CONSTRAINT "events_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "EventInstanceException" (
    "uuid" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "isRescheduled" BOOLEAN,
    "isCancelled" BOOLEAN,
    "isAllDay" BOOLEAN,
    "startTime" TIMESTAMP(6),
    "endTime" TIMESTAMP(6),

    CONSTRAINT "EventInstanceException_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Availability" (
    "uuid" UUID NOT NULL,
    "dayOfWeek" VARCHAR(20),
    "startTime" TIMESTAMP(6),
    "endTime" TIMESTAMP(6),
    "patientId" UUID,
    "employeeId" UUID,

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "tenants" (
    "uuid" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "validUntil" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "userSettings" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "employeeId" UUID,
    "bgColor" VARCHAR(64),
    "tenantId" UUID NOT NULL,
    "validUntil" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "userSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "uuid" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" VARCHAR(64),
    "lastName" VARCHAR(64),
    "a0Id" VARCHAR,
    "validUntil" TIMESTAMPTZ(6),
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "passwordResetToken" TEXT,
    "passwordResetAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "userPermissions" (
    "userId" UUID NOT NULL,
    "permissionId" UUID NOT NULL,
    "tenantId" UUID NOT NULL,

    CONSTRAINT "userPermissions_pkey" PRIMARY KEY ("userId","permissionId")
);

-- CreateTable
CREATE TABLE "permissionLevels" (
    "uuid" UUID NOT NULL,
    "displayName" VARCHAR(64) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "tenantId" UUID NOT NULL,

    CONSTRAINT "permissionLevels_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "contactData" (
    "uuid" UUID NOT NULL,
    "userId" UUID,
    "employeeId" UUID,
    "patientId" UUID,
    "doctorId" UUID,
    "institutionId" UUID,
    "type" VARCHAR(64) NOT NULL,
    "contact" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" UUID NOT NULL,

    CONSTRAINT "contactData_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "patients" (
    "uuid" UUID NOT NULL,
    "firstName" VARCHAR(64),
    "lastName" VARCHAR(64),
    "title" VARCHAR(64),
    "gender" VARCHAR(10),
    "street" VARCHAR(64),
    "zip" VARCHAR(10),
    "city" VARCHAR(64),
    "birthday" DATE,
    "insurance" VARCHAR(64),
    "insuranceNumber" VARCHAR(64),
    "insuranceCardNumber" VARCHAR(64),
    "insuranceCardValid" VARCHAR(64),
    "notices" VARCHAR(255) DEFAULT '',
    "careFacility" VARCHAR(64),
    "state" VARCHAR(64),
    "appointmentRequest" VARCHAR(64),
    "medicalReport" VARCHAR(255) DEFAULT '',
    "isAddpayFreed" BOOLEAN NOT NULL,
    "addPayFreedFrom" DATE,
    "addPayFreedUntil" DATE,
    "validUntil" DATE,
    "firstContactAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isWaitingSince" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "doctorId" UUID,
    "institutionId" UUID,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "hasPrescription" BOOLEAN NOT NULL DEFAULT false,
    "hasContract" BOOLEAN NOT NULL DEFAULT false,
    "isWaitingAgain" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Doctor" (
    "uuid" UUID NOT NULL,
    "firstName" VARCHAR(64),
    "lastName" VARCHAR(64),
    "title" VARCHAR(64),
    "street" VARCHAR(64),
    "zip" VARCHAR(10),
    "city" VARCHAR(64),
    "tenantId" UUID NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "CancellationReason" (
    "id" VARCHAR(10) NOT NULL,
    "description" VARCHAR(64) NOT NULL,
    "tenantId" UUID,

    CONSTRAINT "CancellationReason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Institution" (
    "uuid" UUID NOT NULL,
    "name" VARCHAR(64),
    "description" VARCHAR(64),
    "street" VARCHAR(64),
    "zip" VARCHAR(10),
    "city" VARCHAR(64),
    "tenantId" UUID NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Institution_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "appSettings_tenantId_key" ON "appSettings"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "userSettings_employeeId_key" ON "userSettings"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "appSettings" ADD CONSTRAINT "appSettings_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildings" ADD CONSTRAINT "buildings_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employeeTeams" ADD CONSTRAINT "employeeTeams_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employeeTeams" ADD CONSTRAINT "employeeTeams_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_cancellationReasonId_fkey" FOREIGN KEY ("cancellationReasonId") REFERENCES "CancellationReason"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_parentEventId_fkey" FOREIGN KEY ("parentEventId") REFERENCES "events"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_ressourceId_fkey" FOREIGN KEY ("ressourceId") REFERENCES "employees"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventInstanceException" ADD CONSTRAINT "EventInstanceException_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userSettings" ADD CONSTRAINT "userSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userSettings" ADD CONSTRAINT "userSettings_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userPermissions" ADD CONSTRAINT "userPermissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userPermissions" ADD CONSTRAINT "userPermissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissionLevels"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contactData" ADD CONSTRAINT "contactData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contactData" ADD CONSTRAINT "contactData_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contactData" ADD CONSTRAINT "contactData_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contactData" ADD CONSTRAINT "contactData_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contactData" ADD CONSTRAINT "contactData_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
