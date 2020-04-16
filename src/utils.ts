interface Pattern {
  name: string;
  main: Function;
}

interface PatternExport {
  [key: string]: Pattern;
}

export function getLogger(debugEnabled = true) {
  const logFunc: any = console.log;

  logFunc.debug = (...args: any[]) => {
    if (debugEnabled) {
      console.log('DEBUG:', ...args);
    }
  };

  return logFunc;
}

const log = getLogger(false);

log.debug('HELLOOOOOO DEBUG');

export const handlePattern = (pattern: Pattern) => {
  const { name, main } = pattern;
  log(`### ${name} Pattern\n`);
  main();
  log('\n---\n');
};

export const handlePatterns = (type: string, patterns: PatternExport) => {
  log(`## ${type.toUpperCase()} PATTERNS\n`);
  Object.values(patterns).forEach(pattern => {
    handlePattern(pattern);
  });
};
