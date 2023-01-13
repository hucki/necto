-- CreateTable
CREATE TABLE "AddpayFreedom" (
    "uuid" UUID NOT NULL,
    "pid" UUID,
    "freedFrom" TIMESTAMPTZ(6),
    "freedUntil" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" UUID NOT NULL,

    CONSTRAINT "AddpayFreedom_pkey" PRIMARY KEY ("uuid")
);

-- AddForeignKey
ALTER TABLE "AddpayFreedom" ADD CONSTRAINT "AddpayFreedom_pid_fkey" FOREIGN KEY ("pid") REFERENCES "patients"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
