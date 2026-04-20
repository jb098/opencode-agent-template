SHELL := /bin/bash

OS := $(shell uname -s)

.PHONY: help install uninstall

help:
	@echo "Targets:"
	@echo "  make install            Install Node/npm (if missing), Typescript dependencies and Opencode"
	@echo "  make uninstall          Remove TypeScript deps, Opencode CLI, and Node/npm"

install:
	@if command -v npm >/dev/null 2>&1; then \
		echo "npm is already installed: $$(npm --version)"; \
	else \
		if [ "$(OS)" = "Darwin" ]; then \
			if command -v brew >/dev/null 2>&1; then \
				echo "Installing Node.js (includes npm) with Homebrew..."; \
				brew install node; \
			else \
				echo "Homebrew is required on macOS to install Node.js automatically."; \
				echo "Install Homebrew from https://brew.sh and rerun: make install"; \
				exit 1; \
			fi; \
		elif [ "$(OS)" = "Linux" ]; then \
			if [ -f /etc/debian_version ]; then \
				echo "Installing Node.js and npm with apt..."; \
				sudo apt-get update; \
				sudo apt-get install -y nodejs npm; \
			else \
				echo "Unsupported Linux distribution. Please install Node.js and npm manually."; \
				exit 1; \
			fi; \
		else \
			echo "Unsupported OS: $(OS). Please install Node.js and npm manually."; \
			exit 1; \
		fi; \
	fi

	@echo "Installing TypeScript dependencies..."
	npm install --save-dev typescript ts-node @types/node

	@echo "Installing Opencode CLI globally..."
	npm i -g opencode-ai

uninstall:
	@echo "Removing TypeScript dependencies..."
	@if [ -f package.json ]; then \
		npm uninstall --save-dev typescript ts-node @types/node; \
	else \
		echo "No package.json found, skipping local dependency removal."; \
	fi

	@echo "Removing Opencode CLI globally..."
	@if command -v npm >/dev/null 2>&1; then \
		npm uninstall -g opencode-ai || true; \
	else \
		echo "npm is not installed, skipping global uninstall."; \
	fi

	@echo "Removing Node.js and npm from system package manager..."
	@if [ "$(OS)" = "Darwin" ]; then \
		if command -v brew >/dev/null 2>&1; then \
			if brew list --formula | grep -q '^node$$'; then \
				brew uninstall node; \
			else \
				echo "Homebrew node formula not found, skipping."; \
			fi; \
		else \
			echo "Homebrew not found, cannot uninstall node automatically."; \
		fi; \
	elif [ "$(OS)" = "Linux" ]; then \
		if [ -f /etc/debian_version ]; then \
			sudo apt-get remove -y nodejs npm; \
			sudo apt-get autoremove -y; \
		else \
			echo "Unsupported Linux distribution. Remove Node.js and npm manually."; \
		fi; \
	else \
		echo "Unsupported OS: $(OS). Remove Node.js and npm manually."; \
	fi
