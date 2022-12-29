/*
  Warnings:

  - You are about to drop the `_ProductToVendor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProductToVendor" DROP CONSTRAINT "_ProductToVendor_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToVendor" DROP CONSTRAINT "_ProductToVendor_B_fkey";

-- DropTable
DROP TABLE "_ProductToVendor";

-- CreateTable
CREATE TABLE "VendorProduct" (
    "id" SERIAL NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "productId" INTEGER,

    CONSTRAINT "VendorProduct_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VendorProduct" ADD CONSTRAINT "VendorProduct_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorProduct" ADD CONSTRAINT "VendorProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
