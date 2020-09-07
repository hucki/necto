CREATE TABLE "users" ("id" SERIAL PRIMARY KEY, "full_name" varchar, "first_name" varchar, "last_name" varchar, "valid_until" timestamp, "created_at" timestamp, "updated_at" timestamp);

CREATE TABLE "contracts" ("user_id" int UNIQUE NOT NULL, "hours_per_week" int, "appointments_per_week" int);

CREATE TABLE "user_settings" ("user_id" int UNIQUE NOT NULL, "bg_color" varchar);

CREATE TABLE "settings" ("cal_days" varchar, "cal_hours_start" int, "cal_hours_end" int, "timescale_width" int);

CREATE TABLE "events" ("id" int, "user_id" int, "type" varchar, "start_time" timestamp, "end_time" timestamp, "rrule" varchar, "home_visit" boolean);

ALTER TABLE "contracts" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "user_settings" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "events" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
