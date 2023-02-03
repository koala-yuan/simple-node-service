#!/bin/bash


export PROXY_BASE=http://localhost:49543
export PATH_PREFIX=/online/marvelorg

export NODE_OPTIONS="--http-parser=legacy"

npm i && npm run dev


