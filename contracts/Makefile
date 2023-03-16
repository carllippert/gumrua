#!make
include .env

# -------------- DEPLOYMENT -------------- #

deploy: 
	npx hardhat run scripts/deploy.ts --network $(NETWORK)

#-------------- PLAYGROUND ----------------#

set-data:
	npx hardhat run scripts/playground/setData.ts --network $(NETWORK)