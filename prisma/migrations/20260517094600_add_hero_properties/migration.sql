-- AlterTable
ALTER TABLE "Property" ADD COLUMN "showInHero" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Property" ADD COLUMN "heroOrder" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Property_showInHero_isPublished_status_heroOrder_idx" ON "Property"("showInHero", "isPublished", "status", "heroOrder");
