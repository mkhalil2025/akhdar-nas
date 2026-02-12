/*
  Warnings:

  - You are about to drop the column `type` on the `LeaveBalance` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `LeaveRequest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,leaveTypeId,year]` on the table `LeaveBalance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `leaveTypeId` to the `LeaveBalance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leaveTypeId` to the `LeaveRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "LeaveBalance_userId_type_year_key";

-- AlterTable
ALTER TABLE "LeaveBalance" DROP COLUMN "type",
ADD COLUMN     "leaveTypeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LeaveRequest" DROP COLUMN "type",
ADD COLUMN     "leaveTypeId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "LeaveType";

-- CreateTable
CREATE TABLE "LeaveType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaveType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LeaveType_name_key" ON "LeaveType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "LeaveBalance_userId_leaveTypeId_year_key" ON "LeaveBalance"("userId", "leaveTypeId", "year");

-- AddForeignKey
ALTER TABLE "LeaveRequest" ADD CONSTRAINT "LeaveRequest_leaveTypeId_fkey" FOREIGN KEY ("leaveTypeId") REFERENCES "LeaveType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveBalance" ADD CONSTRAINT "LeaveBalance_leaveTypeId_fkey" FOREIGN KEY ("leaveTypeId") REFERENCES "LeaveType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
