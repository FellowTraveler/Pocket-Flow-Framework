#!/usr/bin/env node

import { Command } from 'commander';
import * as path from 'path';
import { generateFromTemplate } from './utils';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../package.json');

const program = new Command();

program
  .name('pocket')
  .version(packageJson.version)
  .description('CLI tool for Pocket Flow Framework development');

const newCommand = program.command('new')
  .description('Generate new Pocket Flow components');

newCommand
  .command('node <name>')
  .description('Generate a new Node component file')
  .option('-p, --path <directory>', 'Specify output directory', 'src/nodes') // Default path
  .action(async (name: string, options: { path: string }) => {
    try {
      const targetDir = path.resolve(process.cwd(), options.path);
      await generateFromTemplate('node', name, targetDir);
    } catch (error) {
      console.error(`Error generating node: ${error instanceof Error ? error.message : error}`);
      process.exit(1);
    }
  });

newCommand
  .command('flow <name>')
  .description('Generate a new Flow component file')
  .option('-p, --path <directory>', 'Specify output directory', 'src/flows') // Default path
  .action(async (name: string, options: { path: string }) => {
    try {
      const targetDir = path.resolve(process.cwd(), options.path);
      await generateFromTemplate('flow', name, targetDir);
    } catch (error) {
      console.error(`Error generating flow: ${error instanceof Error ? error.message : error}`);
      process.exit(1);
    }
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
