#!/bin/bash

# Check all contracts deployed at mainnet address
echo "🔍 Checking contracts at 0x807c3d470888cc48..."
echo ""

flow accounts get 0x807c3d470888cc48 --network mainnet | grep "Contract:"
