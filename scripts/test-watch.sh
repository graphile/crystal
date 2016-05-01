#!/bin/bash

scripts/test.sh \
  --reporter min \
  --watch \
  --watch-extensions json,graphql \
  $@
