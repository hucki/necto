-- CreateTable
CREATE TABLE "TimesheetEntry" (
    "uuid" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "accountId" UUID NOT NULL,
    "value" INTEGER NOT NULL,
    "info" VARCHAR NOT NULL DEFAULT '',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "startTime" TIMESTAMP(6),
    "endTime" TIMESTAMP(6),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" UUID,

    CONSTRAINT "TimesheetEntry_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "TimeType" (
    "uuid" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "unit" VARCHAR NOT NULL,

    CONSTRAINT "TimeType_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "TimesheetPerMonth" (
    "uuid" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "accountId" UUID NOT NULL,
    "value" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "info" VARCHAR NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" UUID,

    CONSTRAINT "TimesheetPerMonth_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Account" (
    "uuid" UUID NOT NULL,
    "timeType" VARCHAR NOT NULL,
    "unit" VARCHAR NOT NULL,
    "validFrom" TIMESTAMP(6),
    "validUntil" TIMESTAMP(6),
    "description" VARCHAR NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" UUID,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "TimeType_name_key" ON "TimeType"("name");

-- AddForeignKey
ALTER TABLE "TimesheetEntry" ADD CONSTRAINT "TimesheetEntry_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimesheetEntry" ADD CONSTRAINT "TimesheetEntry_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimesheetPerMonth" ADD CONSTRAINT "TimesheetPerMonth_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimesheetPerMonth" ADD CONSTRAINT "TimesheetPerMonth_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
