/*
  Warnings:

  - You are about to drop the column `age` on the `Guest` table. All the data in the column will be lost.
  - Added the required column `email` to the `Guest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Guest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Guest" DROP COLUMN "age",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;
