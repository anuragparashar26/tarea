-- AlterTable
ALTER TABLE "public"."tasks" ADD COLUMN     "isImportant" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isMyDay" BOOLEAN NOT NULL DEFAULT false;
