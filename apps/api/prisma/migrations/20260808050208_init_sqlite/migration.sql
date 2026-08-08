-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "companyName" TEXT,
    "phone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mcNumber" TEXT,
    "dotNumber" TEXT,
    "mcStatus" TEXT,
    "complianceCheckedAt" DATETIME,
    "ratingAverage" REAL DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "loads" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shipperId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "originAddress" TEXT NOT NULL,
    "originLat" REAL NOT NULL,
    "originLng" REAL NOT NULL,
    "destAddress" TEXT NOT NULL,
    "destLat" REAL NOT NULL,
    "destLng" REAL NOT NULL,
    "pickupDate" DATETIME NOT NULL,
    "deliveryDate" DATETIME NOT NULL,
    "equipmentType" TEXT NOT NULL,
    "weightLbs" REAL NOT NULL,
    "lengthFt" REAL NOT NULL,
    "widthFt" REAL NOT NULL,
    "heightFt" REAL NOT NULL,
    "commodity" TEXT NOT NULL,
    "imageUrls" TEXT NOT NULL DEFAULT '[]',
    "askingPrice" REAL,
    "acceptedBidId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "loads_shipperId_fkey" FOREIGN KEY ("shipperId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bids" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "loadId" TEXT NOT NULL,
    "carrierId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "bids_loadId_fkey" FOREIGN KEY ("loadId") REFERENCES "loads" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "bids_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pod_documents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "loadId" TEXT NOT NULL,
    "carrierId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "pod_documents_loadId_fkey" FOREIGN KEY ("loadId") REFERENCES "loads" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "carrierId" TEXT NOT NULL,
    "shipperId" TEXT NOT NULL,
    "loadId" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reviews_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "reviews_shipperId_fkey" FOREIGN KEY ("shipperId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "reviews_loadId_fkey" FOREIGN KEY ("loadId") REFERENCES "loads" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ledger_entries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "loadId" TEXT NOT NULL,
    "shipperInfo" TEXT NOT NULL,
    "carrierInfo" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "commodity" TEXT NOT NULL,
    "totalShipperCost" REAL NOT NULL,
    "carrierPayout" REAL NOT NULL,
    "platformCommission" REAL NOT NULL,
    "bookingFeeCharged" REAL NOT NULL,
    "brokerRoutingStatus" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ledger_entries_loadId_fkey" FOREIGN KEY ("loadId") REFERENCES "loads" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ledger_audit_log" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ledgerEntryId" TEXT NOT NULL,
    "loadId" TEXT NOT NULL,
    "shipperInfo" TEXT NOT NULL,
    "carrierInfo" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "commodity" TEXT NOT NULL,
    "totalShipperCost" REAL NOT NULL,
    "carrierPayout" REAL NOT NULL,
    "platformCommission" REAL NOT NULL,
    "bookingFeeCharged" REAL NOT NULL,
    "brokerRoutingStatus" TEXT NOT NULL,
    "snapshotAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "compliance_flag_log" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "carrierId" TEXT NOT NULL,
    "loadId" TEXT NOT NULL,
    "mcNumber" TEXT,
    "mcStatus" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "attemptedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_mcStatus_idx" ON "users"("mcStatus");

-- CreateIndex
CREATE UNIQUE INDEX "loads_acceptedBidId_key" ON "loads"("acceptedBidId");

-- CreateIndex
CREATE INDEX "loads_status_idx" ON "loads"("status");

-- CreateIndex
CREATE INDEX "loads_equipmentType_idx" ON "loads"("equipmentType");

-- CreateIndex
CREATE INDEX "loads_shipperId_idx" ON "loads"("shipperId");

-- CreateIndex
CREATE INDEX "bids_loadId_idx" ON "bids"("loadId");

-- CreateIndex
CREATE INDEX "bids_carrierId_idx" ON "bids"("carrierId");

-- CreateIndex
CREATE INDEX "bids_loadId_status_idx" ON "bids"("loadId", "status");

-- CreateIndex
CREATE INDEX "pod_documents_loadId_idx" ON "pod_documents"("loadId");

-- CreateIndex
CREATE INDEX "reviews_carrierId_idx" ON "reviews"("carrierId");

-- CreateIndex
CREATE INDEX "reviews_loadId_idx" ON "reviews"("loadId");

-- CreateIndex
CREATE UNIQUE INDEX "ledger_entries_loadId_key" ON "ledger_entries"("loadId");

-- CreateIndex
CREATE INDEX "ledger_entries_createdAt_idx" ON "ledger_entries"("createdAt");

-- CreateIndex
CREATE INDEX "ledger_audit_log_ledgerEntryId_idx" ON "ledger_audit_log"("ledgerEntryId");

-- CreateIndex
CREATE INDEX "ledger_audit_log_loadId_idx" ON "ledger_audit_log"("loadId");

-- CreateIndex
CREATE INDEX "compliance_flag_log_carrierId_idx" ON "compliance_flag_log"("carrierId");

-- CreateIndex
CREATE INDEX "compliance_flag_log_attemptedAt_idx" ON "compliance_flag_log"("attemptedAt");
