/*
  Warnings:

  - A unique constraint covering the columns `[name,userId,slug]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,userId]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,categoryId,userId,slug]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Category_name_key";

-- DropIndex
DROP INDEX "Category_slug_key";

-- DropIndex
DROP INDEX "Employee_name_key";

-- DropIndex
DROP INDEX "Product_name_key";

-- DropIndex
DROP INDEX "Product_slug_key";

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_userId_slug_key" ON "Category"("name", "userId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_name_userId_key" ON "Employee"("name", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_categoryId_userId_slug_key" ON "Product"("name", "categoryId", "userId", "slug");
