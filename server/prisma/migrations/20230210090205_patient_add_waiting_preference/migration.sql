-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "createdBy" UUID,
ADD COLUMN     "updatedBy" UUID,
ADD COLUMN     "waitingPreference" VARCHAR(255) DEFAULT '';
