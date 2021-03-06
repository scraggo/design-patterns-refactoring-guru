import { Command, flags } from '@oclif/command';

import { main } from './main';

class DesignPatternsRefactoringGuru extends Command {
  static description = 'describe the command here';

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: 'n', description: 'name of design pattern' }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' }),
  };

  static args = [{ name: 'file' }];

  async run() {
    const { args, flags } = this.parse(DesignPatternsRefactoringGuru);

    // this.log(`hello ${flags.name || 'world'} from ./src/index.ts`);
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`);
    }

    main({ name: flags.name });
  }
}

export = DesignPatternsRefactoringGuru;
