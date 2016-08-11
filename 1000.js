var storage = require('node-persist');
require('moment-precise-range-plugin');
storage.initSync();

var moment = require('moment');
var date = moment().format('YYYY-MM-DD')
var time = moment().format('HH:mm:ss')
var currentTotal =  {};
var currentHours = storage.getItemSync('duration').hours
var currentMin = storage.getItemSync('duration').minutes
var currentSec = storage.getItemSync('duration').seconds
var totalHours = storage.getItemSync('total').totalHours + currentHours
var totalMin = storage.getItemSync('total').totalMin + currentMin
var totalSec = storage.getItemSync('total').totalSec + currentSec
var totalTime = {totalHours,totalMin,totalSec}



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
        type: 'number'
      },
      time: {
        demand: false,
        description: "Date of Timer",
        type: 'number'
    }
  }).help('help');
})
.command('reset', 'resets timer', function (yargs) {
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
  return totalTime;
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
  console.log("Total amount of time logged:  \n", "Hours:   ", currentHours, "\n " +"Minutes: ",currentMin, "\n Seconds: ", currentSec, "\n");
}

//Stop Timer
function stopTimer() {
  var stop = {
    stopDate: date,
    stopTime: time
  };
  storage.setItemSync('stop',stop);

  var started = storage.getItemSync('start').startTime
  var stopped = storage.getItemSync('stop').stopTime
  var sp = storage.getItemSync('start').startDate + " " + started + 'YYYY-MM-DD HH:mm:ss';
  var ep = storage.getItemSync('stop').stopDate + " " + stopped + 'YYYY-MM-DD HH:mm:ss'

  console.log("\nClock started at:  ",started);
  console.log("Clock stopped at:  ",stopped);
  var diff = moment.preciseDiff(sp, ep)
  var diff2 = moment.preciseDiff(sp, ep, true)

  //Store Duration of Current Session
  storage.setItem('duration',diff2);
  console.log("Duration this session: ", diff, "\n");
  aggregate();
  console.log("Total time logged:", "\nHours:   ", totalTime.totalHours, "\nMinutes: ", totalTime.totalMin, "\nSeconds: ", totalTime.totalSec, "\n");

}

//Reset Timer
function resetTimer() {
  totalTime.totalHours = 0;
  totalTime.totalMin = 0;
  totalTime.totalSec = 0;

  var duration = {"years":0,"months":0,"days":0,"hours":0,"minutes":0,"seconds":0,"firstDateWasLater":false}

  storage.setItemSync('total',totalTime);
  storage.setItemSync('duration',duration);
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
