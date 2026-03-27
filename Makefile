.PHONY: bootstrap bootstrap-frontend bootstrap-backend dev dev-frontend dev-backend test test-frontend test-backend test-e2e test-all

bootstrap:
	npm run bootstrap

bootstrap-frontend:
	npm run bootstrap:frontend

bootstrap-backend:
	npm run bootstrap:backend

dev:
	npm run dev

dev-frontend:
	npm run dev:frontend

dev-backend:
	npm run dev:backend

test:
	npm run test

test-frontend:
	npm run test:frontend

test-backend:
	npm run test:backend

test-e2e:
	npm run test:e2e

test-all:
	npm run test:all
