import { expect, test } from '@oclif/test';

import cmd = require('../src');

describe('index.ts', () => {
  test
    .stdout()
    .do(() => cmd.run([]))
    .it('runs default command', (ctx) => {
      expect(ctx.stdout).to.contain('# Design Patterns - refactoring.guru');
    });

  test
    .stdout()
    .do(() => cmd.run(['--name', 'builder']))
    .it('runs hello --name builder', (ctx) => {
      expect(ctx.stdout).to.contain('### Builder Pattern');
    });
});
