CREATE TABLE "users" ("id" SERIAL PRIMARY KEY, "fullName" varchar, "firstName" varchar, "lastName" varchar, "validUntil" timestamp, "createdAt" timestamp, "updatedAt" timestamp);

CREATE TABLE "contracts" ("id" int UNIQUE NOT NULL, "userId" int, "hoursPerWeek" int, "appointmentsPerWeek" int, "validUntil" timestamp, "createdAt" timestamp, "updatedAt" timestamp);

CREATE TABLE "userSettings" ("id" int UNIQUE NOT NULL, "userId" int, "bgColor" varchar, "validUntil" timestamp, "createdAt" timestamp, "updatedAt" timestamp);

CREATE TABLE "settings" ("calDays" varchar, "calHoursStart" int, "calHoursEnd" int, "timescaleWidth" int);

CREATE TABLE "events" ("id" SERIAL UNIQUE NOT NULL, "userId" int, "ressourceId" int, "title" varchar, "type" varchar, "isHomeVisit" boolean, "isAllDay" boolean, "isRecurring" boolean, "isCancelled" boolean, "isCancelledReason" varchar, "rrule" varchar, "startTime" timestamp, "endTime" timestamp, "bgColor" varchar, "createdAt" timestamp, "updatedAt" timestamp, "tenantId" varchar);

ALTER TABLE "contracts" ADD FOREIGN KEY ("userId") REFERENCES "users" ("id");

ALTER TABLE "userSettings" ADD FOREIGN KEY ("userId") REFERENCES "users" ("id");

ALTER TABLE "events" ADD FOREIGN KEY ("userId") REFERENCES "users" ("id");
