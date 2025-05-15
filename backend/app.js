const express = require('express');
const cors = require('cors');
const db = require('./services/db');

const app = express();
app.use(cors());
app.use(express.json());

app.get("/voertuigen", async (req, res) => {
    try {
        const voertuigen = await db("voertuigen");
        res.status(200).json(voertuigen);
    }catch{
        res.status(500).json({message:"internal server error"});

    }
})

app.get("/voertuig/:id", async (req, res) => {
    const {id} = req.params;
    try{
        const voertuig = await db("voertuigen").where("id", id);
        if(voertuig) {
            res.status(200).json(voertuig);
        }else{
            res.status(500).json({message:"voertuig not found"});
        }
    }catch(error){
        res.status(500).json({message:"internal server error"});

    }
})



app.listen(3333, () => {
    console.log("server is running on port 3333");
})