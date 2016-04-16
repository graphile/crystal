#!/bin/bash

babel-watch --watch src \
  src/main.js -- postgres://localhost:5432 --schema forum_example --development
