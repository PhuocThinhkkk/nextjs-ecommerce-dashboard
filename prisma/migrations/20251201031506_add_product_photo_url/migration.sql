/*
  Warnings:

  - You are about to drop the column `photo_url` on the `ProductsSkus` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "photo_url" TEXT;

-- AlterTable
ALTER TABLE "ProductsSkus" DROP COLUMN "photo_url";
