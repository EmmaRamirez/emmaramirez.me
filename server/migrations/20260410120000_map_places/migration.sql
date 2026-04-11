CREATE TYPE "MapPlaceStatus" AS ENUM ('visible', 'hidden');

CREATE TABLE "MapPlace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "regionCode" TEXT NOT NULL,
    "regionName" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "countryName" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "status" "MapPlaceStatus" NOT NULL DEFAULT 'visible',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MapPlace_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MapPlace_status_createdAt_idx" ON "MapPlace"("status", "createdAt");
CREATE INDEX "MapPlace_regionId_createdAt_idx" ON "MapPlace"("regionId", "createdAt");
