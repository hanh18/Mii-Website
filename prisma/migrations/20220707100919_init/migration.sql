/*
  Warnings:

  - You are about to drop the column `amout` on the `product` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` DROP COLUMN `amout`,
    ADD COLUMN `amount` DECIMAL(65, 30) NOT NULL;
