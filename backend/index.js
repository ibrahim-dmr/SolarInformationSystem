const express = require("express");
const fs = require('fs');
const cors = require("cors");
const app = express();

var corsOptions = {
  origin: ["http://localhost:3001", "http://localhost:3000"]
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
const City = db.city;
const District = db.district;

var dbDatas = []

function createInstance(obj, sehir){
  temp =  {
    name: sehir,
    explanation: obj.aciklama,
    picture: obj.picture,
    latitude: obj.location.lat,
    longitude: obj.location.lon,
    ilce1: obj.ilce.i1,
    ilce2: obj.ilce.i2,
    ilce3: obj.ilce.i3,
    ilce4: obj.ilce.i4,
    ilce5: obj.ilce.i5,
    pvout: obj.solar_data.pvout,
    dni: obj.solar_data.dni,
    ghi: obj.solar_data.ghi,
    dif: obj.solar_data.dif,
    gti: obj.solar_data.gti,
    opta: obj.solar_data.opta,
    temp: obj.solar_data.temp
  }
  return temp
}

function createDistrictInstance(obj, ilce){
  temp = {
    name: ilce,
    explanation: obj.aciklama,
    picture: obj.picture,
    latitude: obj.location.lat,
    longitude: obj.location.lon,
    pvout: obj.solar_data.pvout,
    dni: obj.solar_data.dni,
    ghi: obj.solar_data.ghi,
    dif: obj.solar_data.dif,
    gti: obj.solar_data.gti,
    opta: obj.solar_data.opta,
    temp: obj.solar_data.temp
  }
  return temp
}

function jsonParse(callback){
  var obj;
  fs.readFile('./sehirler.json', 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
    var sehirler = Object.keys(obj.sehirler)
    sehirler.forEach(element => {
      dbDatas.push(createInstance(obj.sehirler[element], element))
    });
    callback();
  });
}

function jsonParseForDistricts(callback){
  var obj;
  fs.readFile('./ilce.json', 'utf8', function (err,data){
    if (err) throw err;
    obj = JSON.parse(data);
    var ilceler = Object.keys(obj.ilceler)
    ilceler.forEach(element => {
      dbDatas.push(createDistrictInstance(obj.ilceler[element], element))
    });
    callback();
  });
}

function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
  
  Role.create({
    id: 2,
    name: "admin"
  });
}

// routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/city.routes')(app);
const districtRoutes = require('./routes/district.routes');
districtRoutes(app);

app.get('/express_backend', (req, res) => {
  res.send({ express: 'EXPRESS BACKEND IS READY AND CONNECTED TO REACT' }); 
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get("/api/users", (req, res) => {
  db.sequelize.sync({force: true}).then(() => {
    initial();
    res.send({ express: 'Users veritabanı oluşturuldu.' }); 
  });
});

app.get("/api/cities", (req, res) => {
  jsonParse(() => {
    db.sehirSequelize.sync({force: true}).then(async () => {
      City.bulkCreate(dbDatas).then(()=>{
        res.send({ express: 'Cities veritabanı oluşturuldu.' }); 
      });
    });
  })
});

app.get("/api/districts", (req, res) => {
  jsonParseForDistricts(() => {
    // console.log(dbDatas);
    db.ilceSequelize.sync({force: true}).then(async () => {
      District.bulkCreate(dbDatas).then(()=>{
        res.send({ express: 'Districts veritabanı oluşturuldu.' }); 
      });
    });
  })
});

app.listen(port, () => console.log(`Listening on port ${port}`));