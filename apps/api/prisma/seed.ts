/**
 * Prisma Seed Script
 * Creates demo data: 2 shippers, 4 carriers (varied mcStatus), 5 loads
 * Run: pnpm --filter api exec prisma db seed
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// String-based enum constants (matching Prisma String fields)
const Role = { SHIPPER: "SHIPPER", CARRIER: "CARRIER", AGENT_ADMIN: "AGENT_ADMIN" } as const;
const MCStatus = { ACTIVE: "ACTIVE", INACTIVE: "INACTIVE", BROKER: "BROKER", UNKNOWN: "UNKNOWN" } as const;
const LoadStatus = { DRAFT: "DRAFT", OPEN: "OPEN", BOOKED: "BOOKED", IN_TRANSIT: "IN_TRANSIT", DELIVERED: "DELIVERED", CANCELLED: "CANCELLED" } as const;
const EquipmentType = { FLATBED: "FLATBED", REEFER: "REEFER", DRY_VAN: "DRY_VAN", OTHER: "OTHER" } as const;
const BidStatus = { PENDING: "PENDING", ACCEPTED: "ACCEPTED", REJECTED: "REJECTED", WITHDRAWN: "WITHDRAWN" } as const;


const prisma = new PrismaClient();

async function main() {
  console.info("🌱 Seeding FreightBridge database...");

  const HASH = await bcrypt.hash("Password123!", 12);

  // ── Shippers ──────────────────────────────────────────────────────────────

  const shipper1 = await prisma.user.upsert({
    where: { email: "alice@acmeshipping.com" },
    update: {},
    create: {
      role: Role.SHIPPER,
      email: "alice@acmeshipping.com",
      passwordHash: HASH,
      fullName: "Alice Nguyen",
      companyName: "Acme Shipping Co.",
      phone: "555-100-0001",
    },
  });

  const shipper2 = await prisma.user.upsert({
    where: { email: "bob@globaltrade.com" },
    update: {},
    create: {
      role: Role.SHIPPER,
      email: "bob@globaltrade.com",
      passwordHash: HASH,
      fullName: "Bob Martinez",
      companyName: "Global Trade Partners",
      phone: "555-100-0002",
    },
  });

  // ── Carriers ───────────────────────────────────────────────────────────────
  // Mix of ACTIVE / INACTIVE / BROKER / UNKNOWN so compliance vetting is testable

  const carrierActive1 = await prisma.user.upsert({
    where: { email: "carol@swifthaul.com" },
    update: {},
    create: {
      role: Role.CARRIER,
      email: "carol@swifthaul.com",
      passwordHash: HASH,
      fullName: "Carol Davis",
      companyName: "Swift Haul LLC",
      phone: "555-200-0001",
      mcNumber: "MC-111111",
      dotNumber: "DOT-555001",
      mcStatus: MCStatus.ACTIVE,
      complianceCheckedAt: new Date(),
      ratingAverage: 4.8,
      ratingCount: 24,
    },
  });

  const carrierActive2 = await prisma.user.upsert({
    where: { email: "dan@ironwheels.com" },
    update: {},
    create: {
      role: Role.CARRIER,
      email: "dan@ironwheels.com",
      passwordHash: HASH,
      fullName: "Dan Kowalski",
      companyName: "Iron Wheels Transport",
      phone: "555-200-0002",
      mcNumber: "MC-222222",
      dotNumber: "DOT-555002",
      mcStatus: MCStatus.ACTIVE,
      complianceCheckedAt: new Date(),
      ratingAverage: 4.2,
      ratingCount: 11,
    },
  });

  const carrierInactive = await prisma.user.upsert({
    where: { email: "eve@oldrigs.com" },
    update: {},
    create: {
      role: Role.CARRIER,
      email: "eve@oldrigs.com",
      passwordHash: HASH,
      fullName: "Eve Thompson",
      companyName: "Old Rigs LLC",
      phone: "555-200-0003",
      mcNumber: "MC-333333",
      dotNumber: "DOT-555003",
      mcStatus: MCStatus.INACTIVE,
      complianceCheckedAt: new Date(),
      ratingAverage: 3.0,
      ratingCount: 5,
    },
  });

  const carrierBroker = await prisma.user.upsert({
    where: { email: "frank@fastbroker.com" },
    update: {},
    create: {
      role: Role.CARRIER,
      email: "frank@fastbroker.com",
      passwordHash: HASH,
      fullName: "Frank Rivera",
      companyName: "Fast Broker Solutions",
      phone: "555-200-0004",
      mcNumber: "MC-444444",
      dotNumber: "DOT-555004",
      mcStatus: MCStatus.BROKER,
      complianceCheckedAt: new Date(),
      ratingAverage: 0,
      ratingCount: 0,
    },
  });

  // ── Agent Admin ────────────────────────────────────────────────────────────

  await prisma.user.upsert({
    where: { email: "admin@freightbridge.com" },
    update: {},
    create: {
      role: Role.AGENT_ADMIN,
      email: "admin@freightbridge.com",
      passwordHash: HASH,
      fullName: "FreightBridge Admin",
      companyName: "FreightBridge Operations",
    },
  });

  // ── Loads ──────────────────────────────────────────────────────────────────

  // Load 1: OPEN — multiple bids
  const load1 = await prisma.load.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      shipperId: shipper1.id,
      status: LoadStatus.OPEN,
      originAddress: "Chicago, IL 60601",
      originLat: 41.8827,
      originLng: -87.6233,
      destAddress: "Detroit, MI 48201",
      destLat: 42.3314,
      destLng: -83.0458,
      pickupDate: new Date("2025-09-01T08:00:00Z"),
      deliveryDate: new Date("2025-09-02T17:00:00Z"),
      equipmentType: EquipmentType.DRY_VAN,
      weightLbs: 18000,
      lengthFt: 48,
      widthFt: 8.5,
      heightFt: 9,
      commodity: "Automotive Parts",
      imageUrls: "[]",
      askingPrice: 1400,
    },
  });

  // Load 2: OPEN — flatbed, shipper 2
  const load2 = await prisma.load.upsert({
    where: { id: "00000000-0000-0000-0000-000000000002" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000002",
      shipperId: shipper2.id,
      status: LoadStatus.OPEN,
      originAddress: "Dallas, TX 75201",
      originLat: 32.7767,
      originLng: -96.797,
      destAddress: "Houston, TX 77001",
      destLat: 29.7604,
      destLng: -95.3698,
      pickupDate: new Date("2025-09-03T07:00:00Z"),
      deliveryDate: new Date("2025-09-03T18:00:00Z"),
      equipmentType: EquipmentType.FLATBED,
      weightLbs: 32000,
      lengthFt: 53,
      widthFt: 8.5,
      heightFt: 4,
      commodity: "Steel Coils",
      imageUrls: "[]",
      askingPrice: 900,
    },
  });

  // Load 3: DRAFT — shipper 1
  await prisma.load.upsert({
    where: { id: "00000000-0000-0000-0000-000000000003" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000003",
      shipperId: shipper1.id,
      status: LoadStatus.DRAFT,
      originAddress: "Atlanta, GA 30301",
      originLat: 33.749,
      originLng: -84.388,
      destAddress: "Nashville, TN 37201",
      destLat: 36.1627,
      destLng: -86.7816,
      pickupDate: new Date("2025-09-10T09:00:00Z"),
      deliveryDate: new Date("2025-09-10T20:00:00Z"),
      equipmentType: EquipmentType.REEFER,
      weightLbs: 22000,
      lengthFt: 48,
      widthFt: 8.5,
      heightFt: 9,
      commodity: "Frozen Foods",
      imageUrls: "[]",
      askingPrice: null,
    },
  });

  // Load 4: BOOKED — has accepted bid, ledger entry will be added
  const load4 = await prisma.load.upsert({
    where: { id: "00000000-0000-0000-0000-000000000004" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000004",
      shipperId: shipper2.id,
      status: LoadStatus.BOOKED,
      originAddress: "Phoenix, AZ 85001",
      originLat: 33.4484,
      originLng: -112.074,
      destAddress: "Los Angeles, CA 90001",
      destLat: 34.0522,
      destLng: -118.2437,
      pickupDate: new Date("2025-08-25T06:00:00Z"),
      deliveryDate: new Date("2025-08-26T14:00:00Z"),
      equipmentType: EquipmentType.DRY_VAN,
      weightLbs: 15000,
      lengthFt: 48,
      widthFt: 8.5,
      heightFt: 9,
      commodity: "Consumer Electronics",
      imageUrls: "[]",
      askingPrice: 2200,
    },
  });

  // Load 5: DELIVERED — shipper 1
  await prisma.load.upsert({
    where: { id: "00000000-0000-0000-0000-000000000005" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000005",
      shipperId: shipper1.id,
      status: LoadStatus.DELIVERED,
      originAddress: "Seattle, WA 98101",
      originLat: 47.6062,
      originLng: -122.3321,
      destAddress: "Portland, OR 97201",
      destLat: 45.5051,
      destLng: -122.675,
      pickupDate: new Date("2025-08-15T08:00:00Z"),
      deliveryDate: new Date("2025-08-15T16:00:00Z"),
      equipmentType: EquipmentType.DRY_VAN,
      weightLbs: 9000,
      lengthFt: 40,
      widthFt: 8,
      heightFt: 8,
      commodity: "Coffee Beans",
      imageUrls: "[]",
      askingPrice: 650,
    },
  });

  // ── Bids ───────────────────────────────────────────────────────────────────

  // Bids on load 1 (OPEN)
  await prisma.bid.upsert({
    where: { id: "00000000-0000-0000-0000-000000000101" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000101",
      loadId: load1.id,
      carrierId: carrierActive1.id,
      amount: 1250,
      status: BidStatus.PENDING,
      message: "Can pick up on time, have the right equipment.",
    },
  });

  await prisma.bid.upsert({
    where: { id: "00000000-0000-0000-0000-000000000102" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000102",
      loadId: load1.id,
      carrierId: carrierActive2.id,
      amount: 1380,
      status: BidStatus.PENDING,
      message: "Reliable service, next-day guaranteed.",
    },
  });

  // Bids on load 2 (OPEN)
  await prisma.bid.upsert({
    where: { id: "00000000-0000-0000-0000-000000000103" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000103",
      loadId: load2.id,
      carrierId: carrierActive1.id,
      amount: 850,
      status: BidStatus.PENDING,
      message: "Flatbed available, same-day possible.",
    },
  });

  // Accepted bid on load 4 (BOOKED)
  const acceptedBid = await prisma.bid.upsert({
    where: { id: "00000000-0000-0000-0000-000000000104" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000104",
      loadId: load4.id,
      carrierId: carrierActive1.id,
      amount: 2100,
      status: BidStatus.ACCEPTED,
      message: "Ready to roll, AZ-CA runs are my specialty.",
    },
  });

  // Update load 4 with accepted bid ID
  await prisma.load.update({
    where: { id: load4.id },
    data: { acceptedBidId: acceptedBid.id },
  });

  // ── Ledger Entry for load 4 ────────────────────────────────────────────────

  const shipperInfo = {
    id: shipper2.id,
    fullName: shipper2.fullName,
    companyName: shipper2.companyName,
    email: shipper2.email,
  };

  const carrierInfo = {
    id: carrierActive1.id,
    fullName: carrierActive1.fullName,
    companyName: carrierActive1.companyName,
    mcNumber: carrierActive1.mcNumber,
    dotNumber: carrierActive1.dotNumber,
    mcStatus: carrierActive1.mcStatus,
  };

  const bookingFee = Math.round(2200 * 0.1 * 100) / 100;
  const shipperInfoStr = JSON.stringify(shipperInfo);
  const carrierInfoStr = JSON.stringify(carrierInfo);

  const ledger = await prisma.ledgerEntry.upsert({
    where: { loadId: load4.id },
    update: {},
    create: {
      loadId: load4.id,
      shipperInfo: shipperInfoStr,
      carrierInfo: carrierInfoStr,
      origin: "Phoenix, AZ 85001",
      destination: "Los Angeles, CA 90001",
      commodity: "Consumer Electronics",
      totalShipperCost: 2200,
      carrierPayout: 2100,
      platformCommission: bookingFee,
      bookingFeeCharged: bookingFee,
      brokerRoutingStatus: "SYNCED",
    },
  });

  // Append-only audit log entry
  await prisma.ledgerAuditLog.upsert({
    where: { id: "00000000-0000-0000-0000-000000000201" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000201",
      ledgerEntryId: ledger.id,
      loadId: load4.id,
      shipperInfo: shipperInfoStr,
      carrierInfo: carrierInfoStr,
      origin: "Phoenix, AZ 85001",
      destination: "Los Angeles, CA 90001",
      commodity: "Consumer Electronics",
      totalShipperCost: 2200,
      carrierPayout: 2100,
      platformCommission: bookingFee,
      bookingFeeCharged: bookingFee,
      brokerRoutingStatus: "SYNCED",
    },
  });

  console.info("✅ Seed complete:");
  console.info(`   Shippers: alice@acmeshipping.com, bob@globaltrade.com`);
  console.info(
    `   Carriers: carol@swifthaul.com (ACTIVE), dan@ironwheels.com (ACTIVE), eve@oldrigs.com (INACTIVE), frank@fastbroker.com (BROKER)`,
  );
  console.info(`   Admin:    admin@freightbridge.com`);
  console.info(`   All accounts password: Password123!`);
  console.info(`   Loads: ${[load1.id, load2.id, "...(3)", "...(4)", "...(5)"].join(", ")}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
