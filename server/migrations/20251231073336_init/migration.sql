-- CreateTable
CREATE TABLE "DebugSettings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "headerBlendMode" TEXT NOT NULL,
    "showSectionsEnabled" BOOLEAN NOT NULL,
    "hero3dParams" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DebugSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DebugSettings_key_key" ON "DebugSettings"("key");
