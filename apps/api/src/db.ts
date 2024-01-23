import { Database, Service, ServiceOptions, IDocument } from '@paralect/node-mongo';

import config from 'config';
console.log('config.MONGO_URI', config.MONGO_URI);
const database = new Database(config.MONGO_URI, config.MONGO_DB_NAME);
try {
  database.connect();
} catch (e) {
  console.log('connect e', e);
}


class CustomService<T extends IDocument> extends Service<T> {
  // You can add new methods or override existing here
}

function createService<T extends IDocument>(collectionName: string, options: ServiceOptions = {}) {
  return new CustomService<T>(collectionName, database, options);
}

export default {
  database,
  createService,
};
