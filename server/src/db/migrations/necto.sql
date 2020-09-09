CREATE TABLE "users" ("id" SERIAL PRIMARY KEY, "fullName" varchar, "firstName" varchar, "lastName" varchar, "validUntil" timestamp, "createdAt" timestamp, "updatedAt" timestamp);

CREATE TABLE "contracts" ("userId" int UNIQUE NOT NULL, "hoursPerWeek" int, "appointmentsPerWeek" int);

CREATE TABLE "userSettings" ("userId" int UNIQUE NOT NULL, "bgColor" varchar);

CREATE TABLE "settings" ("calDays" varchar, "calHoursStart" int, "calHoursEnd" int, "timescaleWidth" int);

CREATE TABLE "events" ("id" int, "userId" int, "type" varchar, "name" varchar, "startTime" timestamp, "endTime" timestamp, "rrule" varchar, "homeVisit" boolean);

ALTER TABLE "contracts" ADD FOREIGN KEY ("userId") REFERENCES "users" ("id");

ALTER TABLE "userSettings" ADD FOREIGN KEY ("userId") REFERENCES "users" ("id");

ALTER TABLE "events" ADD FOREIGN KEY ("userId") REFERENCES "users" ("id");
