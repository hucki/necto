/*
  Warnings:

  - You are about to drop the column `timeType` on the `Account` table. All the data in the column will be lost.
  - Added the required column `timeTypeId` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "timeType",
ADD COLUMN     "timeTypeId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_timeTypeId_fkey" FOREIGN KEY ("timeTypeId") REFERENCES "TimeType"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
