#!/bin/bash

mocha \
  tests/*.test.js tests/*/*.test.js tests/*/*/*.test.js \
  --require babel-register \
  --require ./src/promisify.js \
  $@
