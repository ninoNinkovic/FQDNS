// Generated by CoffeeScript 1.9.1
var FQServer, FQServerPort, ID_ADDR_QUEUE_SIZE, common, crypto, dgram, enQueue, findQueue, idAddrQueue, idAddrQueuePointer, listenSocket;

dgram = require('dgram');

common = require('./common');

crypto = require('crypto');

FQServer = common.parseConfig('server_addr');

FQServerPort = parseInt(common.parseConfig('server_port'));

console.log(FQServer, FQServerPort);

idAddrQueue = [];

idAddrQueuePointer = 0;

ID_ADDR_QUEUE_SIZE = 200;

enQueue = function(id, rinfo) {
  idAddrQueuePointer = (idAddrQueuePointer + 1) % ID_ADDR_QUEUE_SIZE;
  return idAddrQueue[idAddrQueuePointer] = {
    id: id,
    rinfo: rinfo
  };
};

findQueue = function(id) {
  var i, j, r, ref;
  for (i = j = 0, ref = ID_ADDR_QUEUE_SIZE; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
    r = idAddrQueue[i];
    if ((r != null) && r.id === id) {
      return r.rinfo;
    }
  }
  return null;
};

listenSocket = dgram.createSocket('udp4');

listenSocket.bind(8053);

listenSocket.on('message', function(msg, rinfo) {
  var id;
  console.log(rinfo);
  if (rinfo.address === FQServer && rinfo.port === FQServerPort) {
    rinfo = findQueue(common.getID(msg));
    if ((rinfo != null)) {
      return listenSocket.send(msg, 0, msg.length, rinfo.port, rinfo.address);
    } else {
      return console.log('Warning: DNS request response match failed');
    }
  } else {
    id = common.getID(msg);
    enQueue(id, rinfo);
    msg = common.encrypt(msg);
    return listenSocket.send(msg, 0, msg.length, FQServerPort, FQServer);
  }
});