-- CreateTable
CREATE TABLE "WaitingPreference" (
    "key" VARCHAR(10) NOT NULL,
    "label" VARCHAR(64) NOT NULL,
    "tenantId" UUID,

    CONSTRAINT "WaitingPreference_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "_PatientToWaitingPreference" (
    "A" UUID NOT NULL,
    "B" VARCHAR(10) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PatientToWaitingPreference_AB_unique" ON "_PatientToWaitingPreference"("A", "B");

-- CreateIndex
CREATE INDEX "_PatientToWaitingPreference_B_index" ON "_PatientToWaitingPreference"("B");

-- AddForeignKey
ALTER TABLE "_PatientToWaitingPreference" ADD CONSTRAINT "_PatientToWaitingPreference_A_fkey" FOREIGN KEY ("A") REFERENCES "patients"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PatientToWaitingPreference" ADD CONSTRAINT "_PatientToWaitingPreference_B_fkey" FOREIGN KEY ("B") REFERENCES "WaitingPreference"("key") ON DELETE CASCADE ON UPDATE CASCADE;
