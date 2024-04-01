const express = require('express');
const serverless = require('serverless-http')
const app = express();
const router = express.Router();
const cors = require("cors");
const mysql = require('mysql');

String.prototype.isNumber = function(){return /^\d+$/.test(this);}

const connection = mysql.createConnection({
    host: 'mysql-139bc1d1-deshwardeshwar5-e027.a.aivencloud.com',
    user: 'deshwar005',
    password: 'AVNS_ZGhXQQZfW0NWNl1F36M',
    database: 'defaultdb',
    port: 14956, 
    ssl: {
      rejectUnauthorized: true,
      ca: `-----BEGIN CERTIFICATE-----
      MIIEQTCCAqmgAwIBAgIULjcK6lVQjDV4HjFsAG8/rQk2xpswDQYJKoZIhvcNAQEM
      BQAwOjE4MDYGA1UEAwwvYTMwOTFhNzUtNWU5OC00NjI1LTliYjEtOWMxOTRkZjJh
      MjhiIFByb2plY3QgQ0EwHhcNMjQwMzIwMTg1NDM1WhcNMzQwMzE4MTg1NDM1WjA6
      MTgwNgYDVQQDDC9hMzA5MWE3NS01ZTk4LTQ2MjUtOWJiMS05YzE5NGRmMmEyOGIg
      UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAJ+kmIpN
      1f3hd8JBEbxvrUAlcX6fsRZNbK7HRSisT8bLOJxGAE1FgyKBPa1K0inWbx5ihhXE
      jq6M6Owh0OfekHrr82nqgdYTyieJpiaMY5xkJZ9NwWKO/G+jnTGbkEUI58PQlecb
      4+f6hC/hBtZy6TsL/M7Yw1htqyyKUo2Jbru8fHWPG0rDeJEMBqir+Oo6pKEPD9Y7
      9AefdyHAuir6w6fTbpgzEbqF1+oKLzW0oc2GIK6v2VNN5CeDJ4n00TlSfezQHEJz
      1f8fxB0KK7iwOwQPNt1lTYgRpqxN4g1Fczj5INciefCfQ2jHk5ZDWliK+pa1qI7q
      mGA27mx3v/j6Gc3/un4sYjXcFM1BIOLOhzAWuxq+TN62Mdewyl9E5r08yBMmE2TM
      rftuk1GuJOPMeKfTVf2N3tSuafmlNevKgsSxlNUrv4fJL3oFLAlmx1eCzHT4ZpQ3
      ICWkNcTE8gJqZuh3hSNMzjCPpqjECg8E8/gq2/XYEH3v9NKkYSLFCTc69QIDAQAB
      oz8wPTAdBgNVHQ4EFgQUZIfvyqTfVDNxWqjSKK6oFlc5zsUwDwYDVR0TBAgwBgEB
      /wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAEtURnYw6sjI4RiO
      +24lTApq0w0i+0cKGxHjj9vM/0LCW/Vclq1eUti6ibkTo2utiaDnQx8BLA/ouzwf
      JI1ygDBN7Pe7HlxExoqLtSgIcsYeTv0bHb1+5Yy8H9rmI4YJlFVn8C595sWEXYcH
      jOi+yfxHh4tTMDI6MhoG57bEqqz2cdBmuaprYHzCFp6Pv9Ef+fNd2CFgBgpsqZnM
      Rapjg51GK8v03K1skZuAKKF4xLzqCJoxGl9E8sCEHzHiE6Blol2/UU6CoFSbcNoG
      I4hHoQxetVKBr8iQDlqNQGTyeA2xJzdLt30B5cyUEPEVZvC33dg8i7TwbewznY9z
      iwEhMmnnFucv65yb2lhAcvhg05CdSVWb95mxis0cyEFk2Yyy6KhItJNQCytg0kRt
      jbwvg9ILW7A2yFXxQgpospaeADofkXVXOacnHnp6ub7ZG6mP5Kh3zNmuada6rw7T
      AXXjCSp1QzUS29qRjKidJjctKzm3aZQTzdlUOu+7+koduOkD2Q==
      -----END CERTIFICATE-----
      `,
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