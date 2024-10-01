build-core:
	npm install
	npx tailwindcss -i entrypoints/global.css  -o ./entrypoints/style.css

build-chrome: build-core
	npm run build

build-firefox: build-core
	bpm run build:firefox

zip-chrome: build-core
	npm run zip

zip-firefox: build-core
	bpm run zip:firefox




