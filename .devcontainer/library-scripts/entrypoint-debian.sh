#!/usr/bin/env bash

npm cache clean --force
npm config set prefix ${NPM_GLOBAL}

npm install -g pnpm

pnpm install
sleep infinity
