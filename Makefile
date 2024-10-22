

build-core:
	npm install
	npx tailwindcss -i entrypoints/global.css  -o ./entrypoints/main/global.css
	npx tailwindcss -i entrypoints/global.css  -o ./entrypoints/popup/global.css

build-chrome: build-core
	npm run build

build-firefox: build-core
	bpm run build:firefox

zip-chrome: build-core
	npm run zip

zip-firefox: build-core
	npm run zip:firefox

docs:
	npx typedoc --skipErrorChecking {src,entrypoints}/**/*.tsx

publish:
	@echo "Publishing version $(grep "[0-9].[0-9].[0-9]" wxt.config.ts -o)?"

.PHONY: docs
