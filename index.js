const AV = require('leanengine');

// 试试拉取数据吧
const APP_ID = "W2t2q2HFHW3umQdTMzzH1zsC";
const APP_KEY = "nAmss0sg8XRIybLWagcKtQNq";
const APP_MASTER_KEY = "jOhqISYvY9VYxq7CXFPg8djo";

AV.init({
	appId: APP_ID,
	appKey: APP_KEY,
	masterKey: APP_MASTER_KEY
});

AV.Cloud.useMasterKey();
