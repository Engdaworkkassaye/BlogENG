const express = require('express');
const routes = require('./routes/routes');
const session = require('express-session');
const exphbs = require('express-handlebars').create({ defaultLayout: 'main' }); // Corrected layout path
const fs = require('fs');

require('dotenv').config();

// import sequelize connection
console.log("at server")

const app = express();
const PORT = process.env.PORT || 3001;

// Set up Handlebars as the view engine
app.engine('handlebars', exphbs.engine); // Modify engine setup
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'your_secret_key', // Secret used to sign the session ID cookie
  resave: false,
  saveUninitialized: true
}));

app.use(routes);

app.get('/', (req, res) => {
  res.render('home', { title: 'Home' });
});

// sync sequelize models to the database, then turn on the server
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
  
  const directoryPath = 'views'; // Replace this with your actual directory path

  try {
    // Check if the directory exists
    if (fs.existsSync(directoryPath)) {
      console.log('Views directory exists.');
    } else {
      console.log('Views directory does not exist.');
    }
  } catch(err) {
    console.error('Error checking views directory:', err);
  }
});
