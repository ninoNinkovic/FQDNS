// Generated by CoffeeScript 1.9.1
var common, crypto, dgram, dnsServer, dnsServerPort, s;

dgram = require('dgram');

common = require('./common');

crypto = require('crypto');

dnsServer = common.parseConfig('dns_server_addr');

dnsServerPort = parseInt(common.parseConfig('dns_server_port'));

s = dgram.createSocket('udp4');

s.bind(12345);

s.on('message', function(msg, rinfo) {
  console.log(rinfo);
  if (rinfo.address !== dnsServer) {
    msg = common.decrypt(msg);
    return s.send(msg, 0, msg.length, dnsServerPort, dnsServer);
  } else {
    return s.send(msg, 0, msg.length, 8053, "127.0.0.1");
  }
});