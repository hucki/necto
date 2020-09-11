CREATE TABLE "users" ("id" SERIAL PRIMARY KEY, "fullName" varchar, "firstName" varchar, "lastName" varchar, "validUntil" timestamp, "createdAt" timestamp, "updatedAt" timestamp);

CREATE TABLE "contracts" ("id" int UNIQUE NOT NULL, "userId" int, "hoursPerWeek" int, "appointmentsPerWeek" int, "validUntil" timestamp, "createdAt" timestamp, "updatedAt" timestamp);

CREATE TABLE "userSettings" ("id" int UNIQUE NOT NULL, "userId" int, "bgColor" varchar, "validUntil" timestamp, "createdAt" timestamp, "updatedAt" timestamp);

CREATE TABLE "settings" ("calDays" varchar, "calHoursStart" int, "calHoursEnd" int, "timescaleWidth" int);

CREATE TABLE "events" ("id" int UNIQUE NOT NULL, "userId" int, "type" varchar, "name" varchar, "startTime" timestamp, "endTime" timestamp, "rrule" varchar, "homeVisit" boolean, "createdAt" timestamp, "updatedAt" timestamp);

ALTER TABLE "contracts" ADD FOREIGN KEY ("userId") REFERENCES "users" ("id");

ALTER TABLE "userSettings" ADD FOREIGN KEY ("userId") REFERENCES "users" ("id");

ALTER TABLE "events" ADD FOREIGN KEY ("userId") REFERENCES "users" ("id");
