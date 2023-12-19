const express = require("express");
const cors = require("cors");
const app = express();

var corsOptions = {
  origin: "http://localhost:3001"
};

const port = process.env.PORT || 3001;

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// database
const db = require("./models");
const Role = db.role;

function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
  
  Role.create({
    id: 3,
    name: "admin"
  });
}

// db.sequelize.sync();
// force: true will drop the table if it already exists
db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Database with { force: true }');
  initial();
});

// routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

app.get('/express_backend', (req, res) => {
  res.send({ express: 'EXPRESS BACKEND IS READY AND CONNECTED TO REACT' }); 
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});




app.listen(port, () => console.log(`Listening on port ${port}`));