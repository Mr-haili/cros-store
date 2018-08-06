import {
  CrossStoreServer,
  CrossStoreClient
} from './cros-store';
import {
  Store
} from './store-engine';

const win = window as any;
win.CrossStoreServer = CrossStoreServer;
win.CrossStoreClient = CrossStoreClient;

export {
  CrossStoreClient,
  CrossStoreServer,
  Store
}
