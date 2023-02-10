-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "deceased" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "finishedReason" VARCHAR(255) DEFAULT '',
ADD COLUMN     "finishedTherapy" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "privatelyInsured" BOOLEAN NOT NULL DEFAULT false;
