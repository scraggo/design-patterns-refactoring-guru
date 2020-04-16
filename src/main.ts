import { getLogger } from './utils';

import * as creational from './creational';
import * as structural from './structural';
import * as behavioral from './behavioral';

const log = getLogger(false);

interface Pattern {
  name: string;
  main: Function;
}

interface PatternExport {
  [key: string]: Pattern;
}

interface MainArgs {
  name?: string;
}

const isMatch = (str1: string, str2: string) => str1.toLowerCase() === str2.toLowerCase();

const handlePattern = (pattern: Pattern) => {
  const { name, main } = pattern;
  log(`### ${name} Pattern\n`);
  main();
  log('\n---\n');
};

const handlePatterns = (type: string, patterns: PatternExport, searchTerm?: string) => {
  log(`## ${type.toUpperCase()} PATTERNS\n`);
  Object.values(patterns).forEach(pattern => {
    if ((searchTerm && isMatch(pattern.name, searchTerm)) || !searchTerm) {
      handlePattern(pattern);
    }
  });
};

export function main(args: MainArgs = {}) {
  const { name } = args;

  log('# Design Patterns - refactoring.guru\n');

  if (name) {
    log(`Displaying ${name} pattern\n`);
  }

  const patternsWithNames = [
    ['creational', creational],
    ['structural', structural],
    ['behavioral', behavioral],
  ];

  patternsWithNames.forEach(([patternName, patterns]) => {
    log.debug(typeof patternName, patternName, patterns, name);
    handlePatterns(patternName as string, patterns as PatternExport, name);
  });
}
