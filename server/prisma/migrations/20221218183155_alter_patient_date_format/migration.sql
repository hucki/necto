-- AlterTable
ALTER TABLE "patients" ALTER COLUMN "birthday" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "addPayFreedFrom" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "addPayFreedUntil" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "validUntil" SET DATA TYPE TIMESTAMPTZ(6);