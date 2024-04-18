INSERT INTO "public"."users" ("username", "email", "password", "role")
VALUES ('admin', 'admin@a.ru', '$2b$05$5qtO3mEST2WDxHIXVkDclekGERbav4hB04DXjyNIUK7WLEcPl1NVO', 'admin')
ON CONFLICT("email") DO NOTHING;