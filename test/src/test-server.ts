import 'promise-polyfill/src/polyfill';
import {
  CrossStorageServerDriver
} from '../../lib/main';

const server = new CrossStorageServerDriver();
(window as any).server = server;
