-- CreateTable
CREATE TABLE "Products" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "imageData" BYTEA NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);
