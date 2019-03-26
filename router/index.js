module.exports = function(app) {  
  // here we list our individual sets of routes to use
  require('./routes/tasks')(app);
  require('./routes/officers')(app);
  require('./routes/poi')(app);
  require('./routes/vehicles')(app);
  require('./routes/stolenproperty')(app);
  require('./routes/licenses')(app);
};