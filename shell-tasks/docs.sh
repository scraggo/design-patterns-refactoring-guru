#!/bin/bash

testGlob="test/**/*.test.ts"
head="docs/head.html"
tail="docs/tail.html"

# File is created here
docHTML="docs/test.html"

# Create intermediate head/tail files
touch "$head" "$tail" && \

# Create docs with "doc" reporter
mocha --reporter=doc "$testGlob" | cat "$head" - "$tail" > "$docHTML" && \

# Remove intermediate head/tail files
rm "$head" "$tail"
