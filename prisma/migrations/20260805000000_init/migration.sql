CREATE TABLE "repositories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "normalized" TEXT NOT NULL,
    "description" TEXT,
    "homepage" TEXT,
    "defaultBranch" TEXT,
    "githubUrl" TEXT,
    "stargazerCount" INTEGER NOT NULL DEFAULT 0,
    "ownerAvatar" TEXT,
    "visibility" TEXT,
    "ownerLogin" TEXT,
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "repositories_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "repositories_normalized_key" ON "repositories"("normalized");

CREATE TABLE "tokens" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "repositoryId" UUID NOT NULL,
    "encryptedToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "tokens_repositoryId_key" ON "tokens"("repositoryId");

CREATE TABLE "star_snapshots" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "repositoryId" UUID NOT NULL,
    "snapshotDate" TIMESTAMP(3) NOT NULL,
    "starCount" INTEGER NOT NULL,
    CONSTRAINT "star_snapshots_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "star_snapshots_repositoryId_snapshotDate_key" ON "star_snapshots"("repositoryId", "snapshotDate");

ALTER TABLE "tokens" ADD CONSTRAINT "tokens_repositoryId_fkey"
    FOREIGN KEY ("repositoryId") REFERENCES "repositories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "star_snapshots" ADD CONSTRAINT "star_snapshots_repositoryId_fkey"
    FOREIGN KEY ("repositoryId") REFERENCES "repositories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
