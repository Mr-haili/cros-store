import { CrossStoreServer } from './server';
import { CrossStoreClient } from './client';

const win = window as any;
win.CrossStoreServer = CrossStoreServer;
win.CrossStoreClient = CrossStoreClient;

export {
  CrossStoreClient,
  CrossStoreServer
}

