#!/usr/bin/env node

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI ?? "";

if (!MONGODB_URI) {
  console.error("X Error: MONGODB_URI environment variable is not defined");
  console.log("\nPlease set the MONGODB_URI environment variable:");
  console.log("  export MONGODB_URI='mongodb://localhost:27017/calendar_db'");
  process.exit(1);
}

type ConnectionState = 0 | 1 | 2 | 3;

const stateNames: Record<ConnectionState, string> = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

async function checkConnection() {
  console.log("Checking MongoDB connection...");
  const maskedUri = MONGODB_URI.replace(/\/\/.*:.*@/, "//***:***@");
  console.log(`Connecting to: ${maskedUri}`);

  try {
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });

    const state = mongoose.connection.readyState as ConnectionState;

    if (state === 1) {
      console.log("MongoDB connection successful!");
      console.log(`Database: ${mongoose.connection.name}`);
      console.log(`Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
      
      // List collections
      const db = mongoose.connection.db;
      if (db) {
        const collections = await db.listCollections().toArray();
        console.log(`📁 Collections (${collections.length}):`);
        collections.forEach((col) => {
          console.log(`   - ${col.name}`);
        });
      }

      await mongoose.disconnect();
      console.log("👋 Disconnected successfully");
      process.exit(0);
    } else {
      console.error(`X Connection state: ${stateNames[state]}`);
      process.exit(1);
    }
  } catch (error) {
    console.error("X MongoDB connection failed:");
    console.error(error);
    process.exit(1);
  }
}

checkConnection();
