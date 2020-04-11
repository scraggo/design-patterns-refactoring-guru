interface Pattern {
  name: string;
  main: Function;
}

interface PatternExport {
  [key: string]: Pattern;
}

export const handlePattern = (pattern: Pattern) => {
  const { name, main } = pattern;
  console.log(`### ${name} Pattern\n`);
  main();
  console.log('\n---\n');
};

export const handlePatterns = (type: string, patterns: PatternExport) => {
  console.log(`## ${type.toUpperCase()} PATTERNS\n`);
  Object.values(patterns).forEach(pattern => {
    handlePattern(pattern);
  });
};
