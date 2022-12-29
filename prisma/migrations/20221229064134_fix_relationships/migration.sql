/*
  Warnings:

  - You are about to drop the column `productId` on the `VendorProduct` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[vendorProductId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "VendorProduct" DROP CONSTRAINT "VendorProduct_productId_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "vendorProductId" INTEGER;

-- AlterTable
ALTER TABLE "VendorProduct" DROP COLUMN "productId";

-- CreateIndex
CREATE UNIQUE INDEX "Product_vendorProductId_key" ON "Product"("vendorProductId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_vendorProductId_fkey" FOREIGN KEY ("vendorProductId") REFERENCES "VendorProduct"("id") ON DELETE SET NULL ON UPDATE CASCADE;
