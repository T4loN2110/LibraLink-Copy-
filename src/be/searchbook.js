function SearchBookByName(url,key){    
    var MongoClient = require('mongodb').MongoClient;

    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var query = { name: /^/+key+/^/ };
    dbo.collection("customers").find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
    });
    });
}  

function SearchBookByGenre(url,...key){    
    var MongoClient = require('mongodb').MongoClient;


    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var query = { name: /^/+key+/^/ };
    dbo.collection("customers").find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
    });
    });
}   