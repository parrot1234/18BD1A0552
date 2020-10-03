const express =require('express');
const app =express();
 let server =require('./server');
 let middleware =require('./middleware');

 const bodyParser =require('body-parser');
 app.use(bodyParser.urlencoded({extended:true}));
 app.use(bodyParser.json());
 const MongoClient =require('mongodb');

 const url='mongodb://127.0.0.1:27017';
 const dbName='hospitalInventory';
 let db

 MongoClient.connect(url,{useUnifiedTopology:true},(err,client)=>
 {
    if(err) return console.log(err);
    db=client.db(dbName);
    console.log(`Connected MongoDB: ${url}`);
    console.log(`Database: ${dbName}`);

 });

 app.get('/hospitaldetails',middleware.checkToken,function (req,res){
     console.log("Fetching data from the Hospital Collection");
     var data= db.collection('hospital').find().toArray()
         .then(result => res.json(result));
 });

 
 app.get('/ventilatordetails',middleware.checkToken,function(req,res){
    console.log("Ventilator info");
    var data= db.collection('Ventilators').find().toArray()
         .then(result => res.json(result));
});
app.post('/searchventbystatus',middleware.checkToken,(req,res)=>
{
   var stat=req.body.status;
   console.log(stat);
   var ventilatordetails=db.collection('Ventilators')
   .find({"status":stat}).toArray().then(result=>res.json(result));
});

app.post('/searchventbyname',middleware.checkToken,(req,res)=>{
   var name=req.query.name;
   console.log(name);
   var ventilatordetails = db.collection('Ventilators')
   .find({'name':new RegExp(name,'i')}).toArray().then(result => res.json(result));
});

app.put('/updateventilator', middleware.checkToken, (req, res) => {
   var ventid={ ventilatorId: req.body.ventilatorId};
   console.log(ventid);
   var newvalues={ $set: {
       status: req.body.status}
   };
   db.collection("Ventilators").updateOne(ventid, newvalues, function(err, result){
       res.json("1 document updated");
       if(err) throw err;
   });
});
app.put('/add_details_ventilator',(req,res)=>{
   var details=req.body;
   console.log(details);
   db.collection('Ventilators').insertOne(details).then(result => res.json(result));;
});
app.put('/add_details_hospital',(req,res)=>{
   var details=req.body;
   console.log(details);
   db.collection('hospital').insertOne(details).then(result => res.json(result));;
});
app.delete('/deleteventbyid', middleware.checkToken, (req, res) => {
   var myquery = req.query.ventilatorId ;
   console.log(myquery);

   var myquery1 = { ventilatorId: myquery };
   db.collection('Ventilators').deleteOne(myquery1, function(err, obj){
       if(err) throw err;
       res.json("1 document deleted");
   });
});
app.listen(1100,function(){console.log("server connected")});