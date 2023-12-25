-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" CHAR NOT NULL,
    "email" CHAR NOT NULL,
    "password" CHAR NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
