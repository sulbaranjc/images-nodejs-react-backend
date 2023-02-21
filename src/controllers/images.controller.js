import { pool } from "../db.js"
import fs from "fs";


export const listImage = async (req, res)=> {
  try{
    const [rows] = await pool.query("SELECT * FROM image")
    const namefiles = [];
    rows.map(img => {
      const namefile='JC-'+img.id+'.png'
      fs.writeFileSync('./dbimages/'+namefile,img.data)
      namefiles.push(namefile)
      // console.log(namefile);
    })
    // console.log(rows);
    res.json(namefiles) 
    
  }catch(error){
    return res.status(50).json({message : "Something goes wrong"})
  }

// console.log(req.file);
// res.send("image saved");
}

export const uploadImage = async (req, res)=> {
    try{
      const type = req.file.mimetype  
      const name = req.file.originalname
      const data = fs.readFileSync('./uploads/'+req.file.filename)
      const [rows] = await pool.query("INSERT INTO image  ( type, name, data ) VALUES (?, ?, ?)",[type, name, data])
      res.send({ 
        id: rows.insertId,
        name,
        type,
      }) 
    }catch(error){
      return res.status(50).json({message : "Something goes wrong"})
    }

  // console.log(req.file);
  // res.send("image saved");
}

export const deleteImage = async (req, res)=> {
  try{
    const [result] = await pool.query("DELETE FROM image WHERE id = ?",[req.params.id])
    if (result.affectedRows <= 0) return res.status(404).json({menssage: "Client not found"})
    res.sendStatus(204)
     fs.unlinkSync('./dbimages/JC-'+req.params.id+'.png')
    // console.log('./dbimages/JC-'+req.params.id+'.png');

  }catch(error){
    return res.status(50).json({message : "Something goes wrong"})
  }

// console.log(req.file);
// res.send("image saved");
}