import { handlePatterns } from './utils';

import * as creational from './creational';
import * as structural from './structural';
import * as behavioral from './behavioral';

export function main() {
  console.log('# Design Patterns - refactoring.guru\n');
  handlePatterns('creational', creational);
  handlePatterns('structural', structural);
  handlePatterns('behavioral', behavioral);
}
