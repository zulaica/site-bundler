import { exit, stderr, stdout } from 'node:process';
import { clearLine, cursorTo } from 'node:readline';
import { EMOJI } from './constants.mjs';

export default class Logger {
  static error = (error) => {
    stderr.write(`\n${EMOJI.noEntry} An error has occurred\n`);
    stderr.write(error.toString());
    exit(1);
  };

  static message = (message, update = false) => {
    if (process.env.NODE_ENV !== 'test') {
      if (update) {
        cursorTo(stdout, 0);
        clearLine(stdout, 0);
      }
      stdout.write(message);
    }
  };
}
