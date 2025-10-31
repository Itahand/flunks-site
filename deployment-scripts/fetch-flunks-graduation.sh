#!/bin/bash

echo "📥 Fetching FlunksGraduation contract from mainnet..."
echo ""

flow accounts get 0x807c3d470888cc48 --network mainnet | sed -n '/Contract: .FlunksGraduation./,/Contract:/p' | head -n -1
