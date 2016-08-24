const isLoggedIn = require('./util').isLoggedIn;
const contactUs = require('./contact-us');

const developer = require('./developer');
const user = require('./user');
const project = require('./project');

//TODO: shobhita - modify routes. Use /developer/add instead of /addDeveloper
module.exports = function(app) {
  app.get('/contactUs', contactUs.contactUs);

  //developer CRUD
  app.get('/addDeveloper', isLoggedIn, developer.addGet);
  app.post('/addDeveloper', isLoggedIn, developer.addPost);
  app.get('/browseDeveloper', isLoggedIn, developer.browse);
  app.get('/editDeveloper/:id', isLoggedIn, developer.editGet);
  app.post('/editDeveloper/:id', isLoggedIn, developer.editPost);
  app.get('/deleteDeveloper/:id', isLoggedIn, developer.delete);

  //user CRUD
  app.get('/addUser', isLoggedIn, user.addGet);
  app.post('/addUser', isLoggedIn, user.addPost);
  app.get('/browseUser', isLoggedIn, user.browse);
  app.get('/editUser/:id', isLoggedIn, user.editGet);
  app.post('/editUser/:id', isLoggedIn, user.editPost);
  app.get('/deleteUser/:id', isLoggedIn, user.delete);

  //project CRUD
  app.get('/addProject', isLoggedIn, project.addGet);
  app.post('/addProject', isLoggedIn, project.addPost);
  app.get('/browseProject', isLoggedIn, project.browse);
  app.get('/editProject/:id', isLoggedIn, project.editGet);
  app.post('/editProject/:id', isLoggedIn, project.editPost);
  app.get('/deleteProject/:id', isLoggedIn, project.delete);

};
