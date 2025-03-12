/*
  Warnings:

  - You are about to drop the column `unitPrice` on the `OrderItem` table. All the data in the column will be lost.
  - Added the required column `price` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PaymentStatus" ADD VALUE 'IN_PROCESS';
ALTER TYPE "PaymentStatus" ADD VALUE 'IN_MEDIATION';
ALTER TYPE "PaymentStatus" ADD VALUE 'CHARGED_BACK';

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "document" TEXT;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "unitPrice",
ADD COLUMN     "price" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "notificationSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paymentMethodId" TEXT;
