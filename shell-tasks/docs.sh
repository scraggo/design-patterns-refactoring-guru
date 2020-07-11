#!/bin/bash

testGlob="test/**/*.test.ts"

# head/tail contain html before and after the tests
head="src/head.html"
tail="src/tail.html"

# final generated file
docHTML="docs/index.html"

# Create docs with "doc" reporter
# see "$ man cat" for explanation of "-"
mocha --reporter=doc "$testGlob" | cat "$head" - "$tail" > "$docHTML" && \
echo "Created $docHTML"
