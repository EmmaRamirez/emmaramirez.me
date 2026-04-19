-- CreateEnum
CREATE TYPE "AnalyticsEventKind" AS ENUM ('page', 'network', 'interaction', 'render', 'vital', 'paint');

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "clientEventId" TEXT,
    "sessionId" TEXT NOT NULL,
    "route" TEXT,
    "kind" "AnalyticsEventKind" NOT NULL,
    "name" TEXT NOT NULL,
    "source" TEXT,
    "method" TEXT,
    "url" TEXT,
    "status" INTEGER,
    "ok" BOOLEAN,
    "duration" DOUBLE PRECISION,
    "value" DOUBLE PRECISION,
    "unit" TEXT,
    "rating" TEXT,
    "navigationType" TEXT,
    "fromRoute" TEXT,
    "detail" TEXT,
    "clientTimestamp" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnalyticsEvent_clientEventId_key" ON "AnalyticsEvent"("clientEventId");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_createdAt_idx" ON "AnalyticsEvent"("createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_kind_createdAt_idx" ON "AnalyticsEvent"("kind", "createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_route_createdAt_idx" ON "AnalyticsEvent"("route", "createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_sessionId_createdAt_idx" ON "AnalyticsEvent"("sessionId", "createdAt");
