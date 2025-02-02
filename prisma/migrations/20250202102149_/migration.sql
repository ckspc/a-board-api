-- AlterTable
ALTER TABLE "User" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "signInStatus" BOOLEAN NOT NULL DEFAULT false;
