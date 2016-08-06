var storage = require('node-persist');
storage.initSync();
var argv = require('yargs')

  .command('start', 'starts timer', function (yargs) {
    yargs.options({
      date: {
        demand: false,
        description: "Date of Timer",
        type: 'string'
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
