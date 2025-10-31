#!/bin/bash

# Quick Network Verification Script
# Run this to verify your Flow network configuration

echo "🔍 Flow Network Configuration Verification"
echo "=========================================="
echo ""

# Check environment files
echo "📄 Checking environment files..."
echo ""

if [ -f ".env.local" ]; then
  echo "✅ .env.local exists"
  grep "NEXT_PUBLIC_FLOW" .env.local | grep -v "#"
else
  echo "❌ .env.local not found"
fi

echo ""

if [ -f ".env.production" ]; then
  echo "✅ .env.production exists"
  grep "NEXT_PUBLIC_FLOW" .env.production | grep -v "#"
else
  echo "⚠️  .env.production not found"
fi

echo ""
echo "=========================================="
echo ""

# Check FCL config file
echo "📝 Checking FCL config (src/config/fcl.ts)..."
echo ""

if [ -f "src/config/fcl.ts" ]; then
  echo "✅ FCL config exists"
  echo ""
  echo "Network configuration:"
  grep -E "flow.network|accessNode.api" src/config/fcl.ts | head -2
  echo ""
  echo "Contract addresses:"
  grep -E "0x[A-Za-z]+" src/config/fcl.ts | grep -v "//"
else
  echo "❌ FCL config not found"
fi

echo ""
echo "=========================================="
echo ""

# Check for duplicate configs
echo "🔎 Checking for duplicate FCL configs..."
echo ""

CONFIGS=$(find src -name "*flow*config*.ts" -o -name "fcl*.ts" 2>/dev/null)

if [ -z "$CONFIGS" ]; then
  echo "⚠️  No Flow config files found"
else
  echo "Found configuration files:"
  echo "$CONFIGS"
  
  COUNT=$(echo "$CONFIGS" | wc -l)
  if [ $COUNT -gt 1 ]; then
    echo ""
    echo "⚠️  WARNING: Multiple FCL config files found!"
    echo "   This may cause conflicts. Keep only one."
  else
    echo "✅ Single config file (good)"
  fi
fi

echo ""
echo "=========================================="
echo ""

# Check for testnet references
echo "🧪 Checking for testnet references in code..."
echo ""

TESTNET_REFS=$(grep -r "testnet\|rest-testnet" src/ 2>/dev/null | grep -v "node_modules" | grep -v ".md" | wc -l)

if [ $TESTNET_REFS -eq 0 ]; then
  echo "✅ No testnet references found in src/"
else
  echo "⚠️  Found $TESTNET_REFS testnet reference(s) in src/"
  echo ""
  echo "Files with testnet references:"
  grep -r "testnet\|rest-testnet" src/ 2>/dev/null | grep -v "node_modules" | grep -v ".md" | cut -d: -f1 | sort -u
fi

echo ""
echo "=========================================="
echo ""

# Summary
echo "📊 Summary"
echo ""
echo "Expected configuration for MAINNET:"
echo "  • NEXT_PUBLIC_FLOW_ACCESS_NODE: https://access-mainnet-beta.onflow.org"
echo "  • flow.network: \"mainnet\""
echo "  • Contract addresses starting with: 0x807c3d470888cc48"
echo ""
echo "If any testnet references found, check:"
echo "  1. Environment variables (.env.local, .env.production)"
echo "  2. FCL config file (src/config/fcl.ts)"
echo "  3. Browser localStorage (run clear-testnet-cache.js)"
echo ""
echo "=========================================="
