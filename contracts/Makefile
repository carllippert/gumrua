#!make
include .env

# -------------- DEPLOYMENT -------------- #

deploy: 
	npx hardhat run scripts/deploy.ts --network $(NETWORK)

#-------------- PLAYGROUND ----------------#

create-product:
	npx hardhat run scripts/playground/0-createProduct.ts --network $(NETWORK)

buy-product:
	npx hardhat run scripts/playground/1-buyProduct.ts --network $(NETWORK)