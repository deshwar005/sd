const express = require('express');
const serverless = require('serverless-http')
const app = express();
const router = express.Router();
const fs = require('fs');
const cors = require("cors");
const mysql = require('mysql');
console.log(fs.readFileSync("./ca.pem").toString());

String.prototype.isNumber = function(){return /^\d+$/.test(this);}

const aivenpassword = 'AVNS_ZGhXQQZfW0NWNl1F36M';
const connection = mysql.createConnection({
    host: 'mysql-139bc1d1-deshwardeshwar5-e027.a.aivencloud.com',
    user: 'deshwar005',
    password: aivenpassword,
    database: 'defaultdb',
    port: 14956, 
    ssl: {
      rejectUnauthorized: true,
      ca: fs.readFileSync("./ca.pem").toString(),
    }
});


router.get('/',(req,res)=>{
    res.json({
        hi:"hi"
    })
});

router.get('/trackid/:id',function(req,res){
    const sid = req.params.id;
    const search_query =`select * from tracker where sid=${sid}`;
    
    if(sid.isNumber()){
      connection.query(search_query, (error, results) => {
        if(error){
          console.log(error);
        }
        res.status(200).json(results);
      });
    }else{
      res.status(404).json({
        sid:"Invalid sid"
      });
    }
    });



router.post('/login',function(req,res){
    const {username,password} = req.body;
    connection.query(`select * from users where username='${username}' and password_hash='${password}' `,(error,result)=>{
      res.status(200).json(result)
      })
    })


router.post('/updatestatus',function(req,res){
        const {sid,transportname,currentlocation,currentdate,destination,cityname,delivery_status,destinationaddress} = req.body;
        const inset_query =  `INSERT INTO tracker (sid, transportname, currentlocation, destination, cityname, delivery_status,destinationaddress, currentdate) VALUES (${sid}, '${transportname}', '${currentlocation}', '${destination}', '${cityname}', '${delivery_status}','${destinationaddress}', CURRENT_DATE());`; 
      
        connection.query(inset_query,(error,result)=>{
          if(error){
            res.status(201).json({
              failed:'Invalid submit request'
            });
          }else{
            res.status(200).json(result);
          }
        })
      
      })

app.use(cors());
app.use(express.json());
app.use('/.netlify/functions/api',router);
module.exports.handler=serverless(app);