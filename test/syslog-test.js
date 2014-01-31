/*
 * syslog-test.js: Tests for instances of the PosixSyslog transport
 *
 * (C) 2013 Christoph Hartmann
 * MIT LICENSE
 *
 */

var path = require('path'),
  vows = require('vows'),
  assert = require('assert'),
  winston = require('winston'),
  helpers = require('winston/test/helpers');

var PosixSyslog = require('../lib/winston-posix-syslog').PosixSyslog,
  npmTransport = new(winston.transports.PosixSyslog)(),
  syslogTransport = new(winston.transports.PosixSyslog)({
    levels: winston.config.syslog.levels
  })

  var assertPosixSyslog = function (transport) {
    assert.instanceOf(transport, PosixSyslog);
    assert.isFunction(transport.log);
};

vows.describe('winston-posix-syslog').addBatch({
  "An instance of the PosixSyslog Transport": {
    "with npm levels": {
      "should have the proper methods defined": function () {
        assertPosixSyslog(npmTransport);
      },
      "the log() method": helpers.testNpmLevels(npmTransport, "should respond with true", function (ign, err, logged) {
        assert.isNull(err);
        assert.isTrue(logged);
      })
    },
    "with syslog levels": {
      "should have the proper methods defined": function () {
        assertPosixSyslog(syslogTransport);
      },
      "the log() method": helpers.testSyslogLevels(syslogTransport, "should respond with true", function (ign, err, logged) {
        assert.isNull(err);
        assert.isTrue(logged);
      })
    }
  }
}).export(module);