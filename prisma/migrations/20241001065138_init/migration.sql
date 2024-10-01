-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPERADMIN', 'ADMIN', 'MEMBER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "role" "UserRole" NOT NULL DEFAULT 'MEMBER',
    "image" TEXT,
    "imageUrl" TEXT,
    "organisationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organisation" (
    "id" SERIAL NOT NULL,
    "image" TEXT,
    "imageUrl" TEXT,
    "name" TEXT NOT NULL,
    "organisationCode" TEXT NOT NULL DEFAULT '',
    "organisationType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "addressId" TEXT,

    CONSTRAINT "Organisation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "street" TEXT,
    "province" TEXT,
    "city" TEXT,
    "postCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organisationId" INTEGER,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "role" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organisationId" INTEGER,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Farm" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "farmAltitude" TEXT NOT NULL,
    "farmAddressId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Farm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FarmAddress" (
    "id" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "province" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FarmAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionUnit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "capacity" TEXT NOT NULL,
    "waterflowRate" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "farmId" TEXT,

    CONSTRAINT "ProductionUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedSupply" (
    "id" TEXT NOT NULL,
    "feedIngredients" TEXT NOT NULL,
    "feedingGuide" TEXT NOT NULL,
    "productionIntensity" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "feedingPhase" TEXT NOT NULL,
    "lifeStage" TEXT NOT NULL,
    "shelfLife" TEXT NOT NULL,
    "productCode" TEXT NOT NULL,
    "feedSupplierCode" TEXT NOT NULL,
    "brandCode" TEXT NOT NULL,
    "productNameCode" TEXT NOT NULL,
    "productFormatCode" TEXT NOT NULL,
    "animalSizeInLength" TEXT,
    "animalSizeInWeight" TEXT,
    "specie" TEXT NOT NULL,
    "nutritionalPurpose" TEXT NOT NULL,
    "nutritionalClass" TEXT NOT NULL,
    "particleSize" TEXT NOT NULL,
    "productFormat" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "feedSupplier" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeedSupply_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Organisation_addressId_key" ON "Organisation"("addressId");

-- CreateIndex
CREATE INDEX "Organisation_createdAt_idx" ON "Organisation"("createdAt");

-- CreateIndex
CREATE INDEX "Organisation_updatedAt_idx" ON "Organisation"("updatedAt");

-- CreateIndex
CREATE INDEX "Organisation_organisationCode_idx" ON "Organisation"("organisationCode");

-- CreateIndex
CREATE INDEX "Address_createdAt_idx" ON "Address"("createdAt");

-- CreateIndex
CREATE INDEX "Address_updatedAt_idx" ON "Address"("updatedAt");

-- CreateIndex
CREATE INDEX "Contact_createdAt_idx" ON "Contact"("createdAt");

-- CreateIndex
CREATE INDEX "Contact_updatedAt_idx" ON "Contact"("updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Farm_farmAddressId_key" ON "Farm"("farmAddressId");

-- CreateIndex
CREATE INDEX "Farm_createdAt_idx" ON "Farm"("createdAt");

-- CreateIndex
CREATE INDEX "Farm_updatedAt_idx" ON "Farm"("updatedAt");

-- CreateIndex
CREATE INDEX "FarmAddress_createdAt_idx" ON "FarmAddress"("createdAt");

-- CreateIndex
CREATE INDEX "FarmAddress_updatedAt_idx" ON "FarmAddress"("updatedAt");

-- CreateIndex
CREATE INDEX "ProductionUnit_createdAt_idx" ON "ProductionUnit"("createdAt");

-- CreateIndex
CREATE INDEX "ProductionUnit_updatedAt_idx" ON "ProductionUnit"("updatedAt");

-- CreateIndex
CREATE INDEX "FeedSupply_createdAt_idx" ON "FeedSupply"("createdAt");

-- CreateIndex
CREATE INDEX "FeedSupply_updatedAt_idx" ON "FeedSupply"("updatedAt");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organisation" ADD CONSTRAINT "Organisation_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Farm" ADD CONSTRAINT "Farm_farmAddressId_fkey" FOREIGN KEY ("farmAddressId") REFERENCES "FarmAddress"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionUnit" ADD CONSTRAINT "ProductionUnit_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE SET NULL ON UPDATE CASCADE;
