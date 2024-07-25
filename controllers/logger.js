// const { createLogger, format, transports } = require('winston');
// require('winston-mongodb');

// const logger = createLogger({
//   transports: [
//     new transports.MongoDB({
//       db: 'mongodb://localhost:27017/discussionForum', 
//       collection: 'logs',
//       level: 'info',
//       options: {
//         useUnifiedTopology: true
//       },
//       format:format.combine(format.timestamp(),format.json()),
//     })
//   ]
// });


// module.exports = logger;

// logger.js
const { createLogger, format, transports } = require('winston');
const { MongoDB } = require('winston-mongodb'); // <-- Import MongoDB transport

// Your other code

const logger = createLogger({
  transports: [
    new MongoDB({
      db: 'mongodb://localhost:27017/discussionForum', 
      collection: 'logs',
      level: 'info',
      options: {
        useUnifiedTopology: true
      },
      format: format.combine(format.timestamp(), format.json()),
    })
  ]
});

module.exports = logger;

