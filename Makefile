#!make
PROJECT:= $(shell node -p "require('./package.json').name")
NVM=v0.38.0
NODE=v14.16.1

all:
	@echo "Build package ${PROJECT}..."
	npm run build

install: 
	@echo "Installing node project ${PROJECT}..."
	. ${NVM_DIR}/nvm.sh && nvm install ${NODE} && nvm use ${NODE}
	npm install

nvm:
	@echo "Install nvm ${PROJECT}..."
	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/${NVM}/install.sh | bash

svn:
	@echo "Git release ${PROJECT}..."
	bash scripts/release.sh

clean:
	@echo "Clean project ${PROJECT}..."
	rm -rf ./node_modules
	rm -f package-lock.json

help: 
	@echo "install: Install ${PROJECT}"
	@echo "nvm: NVM install${PROJECT}"
	@echo "clean: Clean ${PROJECT}"
	@echo "svn: Release app${PROJECT}"