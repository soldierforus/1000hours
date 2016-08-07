var storage = require('node-persist');
require('moment-precise-range-plugin');
storage.initSync();

var moment = require('moment');
var date = moment().format('YYYY-MM-DD')
var time = moment().format('HH:mm:ss')


var argv = require('yargs')
  .command('start', 'starts timer', function (yargs) {
    yargs.options({
      date: {
        demand: false,
        description: "Date of Timer",
        type: 'string'
      },
      time: {
        demand: false,
        description: "Date of Timer",
        type: 'string'
      }
    }).help('help');
  })
  .command('stop', 'stops timer', function (yargs) {
    yargs.options({
      date: {
        demand: false,
        description: "Date of Timer",
        type: 'string'
      },
      time: {
        demand: false,
        description: "Date of Timer",
        type: 'string'
      }
  }).help('help');
})
.help('help')
.argv;

var command = argv._[0]

function startTimer() {
  var start = {
    startDate: date,
    startTime: time
  };
  console.log ("Clock started at:  ", time);
  storage.setItem('start',start);
}

function stopTimer() {
  var stop = {
    stopDate: date,
    stopTime: time
  };
  storage.setItem('stop',stop);

  var started = storage.getItem('start').startTime
  var stopped = storage.getItem('stop').stopTime
  var sp = storage.getItem('start').startDate + " " + started + 'YYYY-MM-DD HH:mm:ss';
  var ep = storage.getItem('stop').stopDate + " " + stopped + 'YYYY-MM-DD HH:mm:ss'

  console.log("Clock started at:  ",started);
  console.log("Clock stopped at:  ",stopped);
  var diff = moment.preciseDiff(sp, ep)


  console.log("Total duration logged: ", diff);
}

if (command === "start") {
  startTimer();
}

if (command === "stop") {
  stopTimer();
}
