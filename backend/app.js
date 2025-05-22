const express = require('express');
const cors = require('cors');
const db = require('./services/db');
const fs = require("fs");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./services/swagger.json");

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
});

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
});

app.post("/newVoertuig", async (req, res) => {
    const {merk, type, categorie} = req.body;
    if (!merk || !type || !categorie) {
        return res.status(400).json({error: "Vul alle velden in."});
    }
    try {
        const [id] = await db("absences").insert({
            merk,
            type,
            categorie

        });
        res.status(201).json({
            message: "voertuig toegevoegd",
            id: id
        });
    } catch (err) {
        res.status(500).json({error: "Fout bij toevoegen aan de databank"});
    }
});

app.put("/updateVoertuig/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const {merk, type, categorie} = req.body;

    if (!merk || !type || !categorie) {
        return res.status(400).json({error: "Vul alle velden in."});
    }
    try {
        const count = await db("absences")
            .where("id", id)
            .update({merk, type, categorie});

        if (count === 0) {
            res.status(400).json({error: "voertuig niet gevonden"});
        }

        const updated = await db("voertuigen").where({id}).first();

        res.status(200).json({
                message: "voertuig toegevoegd", updated: updated
            }
        );
    } catch (error) {
        res.status(500).json({error: "Fout bij gevonden"});
    }
});

app.delete("/deleteVoertuig/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const deleted = await db("voertuigen").where("id", id).del();

        if (deleted === 0) {
            res.status(404).json({error: "voertuig niet gevonden"});
        }
        res.status(200).json({error: "voertuig verwijderd"});
    } catch {
        res.status(500).json({error: "internal server error"});
    }
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(3333, () => {
    console.log("server is running on port 3333");
});