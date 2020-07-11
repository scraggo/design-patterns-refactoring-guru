# refactoring.guru design patterns

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)

[View design patterns specs here](http://www.scraggo.com/design-patterns-refactoring-guru)

**Educational Repo**

[refactoring.guru](https://refactoring.guru/design-patterns) is an excellent outline of what object-oriented (OOP) design patterns are and goes into incredible depth into how they work. I chose make their TypeScript examples editable and run-able. This has been a great aid to my learning of this topic and TypeScript.

> [Refactoring.Guru](https://refactoring.guru/) makes it easy for you to discover everything you need to know about refactoring, design patterns, SOLID principles, and other smart programming topics.

> Another excellent resource: [Christopher Okhravi - Video series on Design Patterns for Object Oriented Languages](https://www.youtube.com/playlist?list=PLrhzvIcii6GNjpARdnO4ueTUAVR9eMBpc)

## Usage

Reading the code in `src/` is recommended to see how the patterns work. After:

- `npm start` - see console output for all design patterns
- `npm start -- -n <Design Pattern Name>` - see console output for `<Design Pattern Name>` (if found)
- `npm run start-name -- <Design Pattern Name>` - (same as above)
- `npm run test-docs` - generate docs/index.html - this allows you to view the output of the tests (in progress)

To see how TypeScript compiles to JavaScript:

- `npm run build` - compile src to .js in the /dist directory
