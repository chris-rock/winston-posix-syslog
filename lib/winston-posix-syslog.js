var util = require('util'),
    winston = require('winston'),
    posix = require('posix'),
    common = require('winston/lib/winston/common');

var syslogLevels = {
  debug: 'debug',
  info: 'info',
  notice: 'notice',
  warn: 'warning',
  error: 'err',
  crit: 'crit',
  alert: 'alert'
};

var getMasks = function() {
  var masks = {};

  for (var level in syslogLevels) {
    var mask = syslogLevels[level];
    masks[mask] = true;
  }

  return masks;
}

var PosixSyslog = winston.transports.PosixSyslog = function (options) {
  winston.Transport.call(this, options);
  options = options || {};

  this.json        = options.json        || false;
  this.colorize    = options.colorize    || false;
  this.prettyPrint = options.prettyPrint || false;
  this.timestamp   = typeof options.timestamp !== 'undefined' ? options.timestamp : false;
  this.label       = options.label       || null;

  if (this.json) {
    this.stringify = options.stringify || function (obj) {
      return JSON.stringify(obj, null, 2);
    };
  }

  // syslog specific
  this.identity = options.identity || process.title;
  this.facility = options.facility || 'local0';

  this.openLogOptions = {
    cons: options.cons || true,
    ndelay: options.ndelay || true,
    pid: options.pid || true,
    nowait: options.nowait || true,
    odelay: options.odelay || false
  }
};

util.inherits(PosixSyslog, winston.Transport);

PosixSyslog.prototype.name = 'posixSyslog';

PosixSyslog.prototype.log = function (level, msg, meta, callback) {

  if (this.silent) {
    return callback(null, true);
  }

  var self = this,
      output;

  output = common.log({
    colorize:    this.colorize,
    json:        this.json,
    level:       level,
    message:     msg,
    meta:        meta,
    stringify:   this.stringify,
    timestamp:   this.timestamp,
    prettyPrint: this.prettyPrint,
    raw:         this.raw,
    label:       this.label
  });

  // We ignore any incompatible levels
  if (level in syslogLevels) {
    posix.openlog(self.identity, self.openLogOptions, self.facility);
    posix.setlogmask(getMasks());
    posix.syslog(syslogLevels[level], output);
    posix.closelog();
    self.emit('logged');
  }

  callback(null, true);
};

exports.PosixSyslog = PosixSyslog;