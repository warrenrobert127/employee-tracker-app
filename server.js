const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;


//fix these routes

const apiRoutes = require('./routes/apiRoutes.js');
const htmlRoutes = require('./routes/htmlRoutes.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

app.listen(PORT, () => {
   console.log(`API server now on port ${PORT}!`);
});