#!/bin/bash

mocha tests/**/*.test.js --require babel-register --require ./src/promisify.js $@
