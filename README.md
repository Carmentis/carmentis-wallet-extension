# Carmentis Wallet Extension

This repository contains the source code of the Carmentis Wallet Extension (CWE).

## Build the extension
Building the extension produces a zip archive file that can be directly installed on your browser.
```shell
# for chrome
make zip-chrome

# for firefox
make zip-firefox
```

The generated zip file is outputted in the `.output` folder.

## Install the extension
To install the extension, we refer you to our [wallet installation documentation](https://docs.carmentis.io/how-to/get-your-carmentis-wallet#install-your-wallet).

## Generate the technical wallet documentation
The wallet has been documented. To generate the documentation, execute the following command:
```shell
make docs
```

## Publish latest version
A Github action has been developed to automatically update a new release.
If the current repository is clean, execute the following script:
```shell
./scripts/publish.sh
```
Note: To publish the latest version, be sure to not have *uncommited changes*.

Note: The version number of the published version is located in `wxt.config.ts` file.