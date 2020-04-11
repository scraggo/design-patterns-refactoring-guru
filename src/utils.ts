interface Pattern {
  name: string;
  main: Function;
}

interface PatternExport {
  [key: string]: Pattern;
}

export const handlePattern = (pattern: Pattern) => {
  const { name, main } = pattern;
  console.log(name);
  main();
  console.log('------');
};

export const handlePatterns = (type: string, patterns: PatternExport) => {
  console.log(`RUNNING ${type.toUpperCase()} PATTERNS\n******`);
  Object.values(patterns).forEach(pattern => {
    handlePattern(pattern);
  });
};
