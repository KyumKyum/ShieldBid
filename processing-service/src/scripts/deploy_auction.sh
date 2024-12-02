#!/bin/bash

echo $1
echo $2

# Check for minimum required arguments
if [ $# -lt 2 ]; then
    echo "Usage: $0 <auctionId> <consignorId>"
    exit 1
fi

# Capture arguments
AUCTION_ID="$1"
CONSIGNOR_ID="$2"

# Store current directory
RET_DIR="$PWD"

# Check if CONTRACT_DIR is set
if [ -z "$CONTRACT_DIR" ]; then
    echo "Error: CONTRACT_DIR environment variable is not set"
    exit 1
fi

# Change to contract directory
cd "$CONTRACT_DIR" || exit 1

# Ensure jsons directory exists
mkdir -p jsons

# Remove existing file (use -f to prevent error if file doesn't exist)
rm -f "jsons/create_auction.json"

# Create json file
echo "{
    \"auction_id\": \"$AUCTION_ID\",
    \"consignor_id\": \"$CONSIGNOR_ID\"
}" > "jsons/create_auction.json"

# Deploy
npx hardhat run scripts/deploy_auction.ts --network localhost

# Return to original directory
cd "$RET_DIR" || exit 1