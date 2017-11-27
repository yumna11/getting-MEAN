var mongoose = require('mongoose');
var readLine = require('readline');
var dbURI = "mongodb://localhost/Loc8r";
var gracefulShutdown;
mongoose.connect(dbURI);

gracefulShutdown = function (msg,callback) {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through '+msg);
        callback();
    });
};

mongoose.connection.on('connected',function () {
    console.log('Mongoose connected to '+dbURI);
});

mongoose.connection.on('error',function (error) {
    console.log('Mongoose connection error '+error);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});
//for nodemon restart
process.once('SIGUSR2',function () {
   gracefulShutdown("nodemon restart",function () {
       process.kill(process.pid, 'SIGUSR2');
   });
});
//for app termination
process.on('SIGINT', function () {
    gracefulShutdown('app termination', function () {
        process.exit(0);
    });
});
//for heroku app termination
process.on('SIGTERM', function() {
    gracefulShutdown('Heroku app shutdown', function () {
        process.exit(0);
    });
});
require('./location');