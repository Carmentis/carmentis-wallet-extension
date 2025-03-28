

build-core:
	npm install
	npx tailwindcss -i src/entrypoints/global.css  -o src/entrypoints/main/global.css
	npx tailwindcss -i src/entrypoints/global.css  -o src/entrypoints/popup/global.css

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
	./scripts/publish.sh

.PHONY: docs
