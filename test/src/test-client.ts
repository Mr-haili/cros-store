import {
  EasyCrossStore
} from '../../lib/main';

const serverUrl = './cross-store-server.html';
const store = new EasyCrossStore('deep_dark_fantasy');

store.connect(serverUrl);
store
  .read('userName')
  .then(val => console.log(val));
store
  .write('Now You Can See A Key', '你看见了一把钥匙')
  .then(function(val) {
    return store.read('Now You Can See A Key')
  })
  .then(function(val) {
    console.log(val);
  });
