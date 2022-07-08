/*
  Warnings:

  - Changed the type of `paymentDate` on the `order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `paymentDate`,
    ADD COLUMN `paymentDate` DATETIME(3) NOT NULL;
