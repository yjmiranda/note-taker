const express = require("express");
const path = require("path");
const fs = require("fs"); 

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.get("/notes", function(req, res){
    res.sendFile(path.join(__dirname, "/public/notes.html"))
});

app.get("/api/notes", function(req, res){
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.post("/api/notes", function(req, res){
    let newNote = req.body;

    fs.readFile(path.join(__dirname, "/db/db.json"), "utf-8", function(err, data){
        if (err) throw err;

        let db = JSON.parse(data);
        db.push(newNote);

        //sets a unique id for each object
        for(let i = 0; i < db.length; i++){
            db[i].id = i;
        }

        fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(db), function(err){
            if (err) throw err;
            console.log("Added note successfully!");
        });
    });
});

app.delete("/api/notes/:id", function(req, res){
    fs.readFile(path.join(__dirname, "/db/db.json"), "utf-8", function(err, data){
       if (err) throw err;
       
       let db = JSON.parse(data);

       for (var i = 0; i < db.length; i++){
            if(db[i].id === parseInt(req.params.id)){
                db.splice(i,1);
            }
       }

        fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(db), function(err){
            if (err) throw err;
            console.log("Deleted note successfully!");
        });
    });
});

app.get("*", function(req, res){
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});