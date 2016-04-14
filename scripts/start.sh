#!/bin/bash

npm run schema-up

babel-watch --watch src \
  src/main.js -- postgres://localhost:5432 --schema forum_example --development
