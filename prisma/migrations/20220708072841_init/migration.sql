/*
  Warnings:

  - You are about to alter the column `quantity` on the `order_product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `order_product` MODIFY `quantity` INTEGER NOT NULL;
