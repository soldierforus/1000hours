var storage = require('node-persist');
require('moment-precise-range-plugin');
storage.initSync();

var moment = require('moment');
var date = moment().format('YYYY-MM-DD')
var time = moment().format('HH:mm:ss')
var currentTotal =  {};
var currentHours = storage.getItem('duration').hours
var currentMin = storage.getItem('duration').minutes
var currentSec = storage.getItem('duration').seconds
var totalHours = storage.getItem('total').totalHours + currentHours
var totalMin = storage.getItem('total').totalMin + currentMin
var totalSec = storage.getItem('total').totalSec + currentSec
var totalTime = {totalHours,totalMin,totalSec}

//Convert Times
function convertTime () {

  var minToHr = Math.floor(totalMin/60);
  var remMin = totalMin % 60;
  var secToMin = Math.floor(totalSec/60);
  var remSec = totalSec % 60;

  totalTime.totalHours += minToHr;
  totalTime.totalMin = remMin + secToMin;
  totalTime.totalSec = remSec
}
//Command Line Interface
var argv = require('yargs')
  .command('start', 'starts timer', function (yargs) {
    yargs.options({
      date: {
        demand: false,
        description: "Date of Timer",
        type: 'number'
      },
      time: {
        demand: false,
        description: "Date of Timer",
        type: 'number'
      }
    }).help('help');
  })
  .command('stop', 'stops timer', function (yargs) {
    yargs.options({
      date: {
        demand: false,
        description: "Date of Timer",
      },
      time: {
        demand: false,
        description: "Date of Timer",
    }
  }).help('help');
})
.command('reset', 'resets timer', function (yargs) {
  yargs.options({
    date: {
      demand: false,
      description: "Resets the Timer",
    },
    time: {
      demand: false,
      description: "Resets the Timer",
    }
  }).help('help');
})
.command('showtime', 'shows time totals', function (yargs) {
  yargs.options({
    date: {
      demand: false,
      description: "Shows Time totals",
    },
    time: {
      demand: false,
      description: "Date of Timer",
      type: 'number'
    }
  }).help('help');
})
.help('help')
.argv;

var command = argv._[0]

// //Get current time total
function getTotal (){
  if (storage.getItemSync('duration') === undefined) {
    console.log("No previous history")
  } else {
    currentTotal = storage.getItemSync('duration')
    }
  }

//Add time totals
function aggregate() {
  if (storage.getItemSync('total') === undefined) {
    console.log("No previous history")
  } else {
    total = storage.getItem('total')
    storage.setItemSync('total',totalTime)
  }
}

//Start timer
function startTimer() {
  var start = {
    startDate: date,
    startTime: time
  };
  console.log ("\nClock started at:  ", time);
  storage.setItemSync('start',start);
  getTotal();
  showTime();
}

//Show Time
  function showTime() {
    convertTime();
    console.log("\nTotal time logged:", "\nHours:   ", totalTime.totalHours, "\nMinutes: ", totalTime.totalMin, "\nSeconds: ", totalTime.totalSec, "\n");
  }

//Stop Timer
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

  console.log("\nClock started at:  ",started);
  console.log("Clock stopped at:  ",stopped);
  var diff = moment.preciseDiff(sp, ep)
  var diff2 = moment.preciseDiff(sp, ep, true)

  //Store Duration of Current Session
  storage.setItemSync('duration',diff2);
  console.log("Duration this session: ", diff, "\n");
  aggregate();
}

//Reset Timer
function resetTimer() {
  totalTime.totalHours = 0;
  totalTime.totalMin = 0;
  totalTime.totalSec = 0;

  var duration = {"years":0,"months":0,"days":0,"hours":0,"minutes":0,"seconds":0,"firstDateWasLater":false}

  storage.setItem('total',totalTime);
  storage.setItem('duration',duration);
  };

if (command === "start") {
  startTimer();
}

if (command === "stop") {
  stopTimer();
}

if (command === "reset") {
  resetTimer();
}

if (command === "showtime") {
  showTime();
}
