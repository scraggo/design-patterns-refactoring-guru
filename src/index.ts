import { Command, flags } from '@oclif/command';

import { handlePatterns } from './utils';

import * as creational from './creational';
import * as structural from './structural';

class Designpatterns1 extends Command {
  static description = 'describe the command here';

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: 'n', description: 'name to print' }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' }),
  };

  static args = [{ name: 'file' }];

  async run() {
    const { args, flags } = this.parse(Designpatterns1);

    const name = flags.name || 'world';
    this.log(`hello ${name} from ./src/index.ts`);
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`);
    }

    this.log('# Design Patterns - refactoring.guru\n');
    handlePatterns('creational', creational);
    handlePatterns('structural', structural);
  }
}

export = Designpatterns1;
