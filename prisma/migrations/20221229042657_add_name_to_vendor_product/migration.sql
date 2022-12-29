/*
  Warnings:

  - Added the required column `name` to the `VendorProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VendorProduct" ADD COLUMN     "name" TEXT NOT NULL;
