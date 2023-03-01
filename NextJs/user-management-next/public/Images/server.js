const express = require('express');
const fileupload = require("express-fileupload");
const moment = require('moment');
const fs = require('fs')
const app = express();
app.use(fileupload());

const cors = require('cors');
app.use(cors());

app.use(express.json());
const { queryRunner } = require("../user_management/src/Database/DB")
console.log("User App is listening on Port 8000");

// const deleteUser = (recid) => {
//     return new Promise(async(resolve, reject) => {
//     try {
//         const sqlQuery = `update user_avi_final set status1="0" where recid="${recid}"`
//         const ans = await DB.queryRunner(sqlQuery); 
//         resolve(ans);
//     } catch (err) { 
//         reject(err);
//      }
// })
// }

app.post("/userimage", async (req, res) => {
    const file = req.files.file;
    const filename = file.name;
    console.log(filename)
    file.mv(`./images/${filename}`, (err) => {
        if (err) {
            console.log(err);
            return res.status(400).send({ message: "File upload failed" });
        }
        res.status(200).send({ message: `./images/${filename}`, code: 200 });
    });
});

//ADD NEW USER
app.post('/adduser', async (req, res) => {
    console.log(req.body);
    console.log(req.query);
    console.log("vishal");
    const code = req.body.code;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const gender = req.body.gender;
    const hobbies = req.body.hobbies;
    const photo = req.body.photo;
    const country = req.body.country;
   // const dateadded =  new Date().toISOString.slice(0,10);
   
    let dateadded = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    let dateupdated = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    let endeffdt = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

    try {
        const sqlQuery = `insert into vishal_users (code,firstname,lastname,email,gender,hobbies,photo,country,dateadded,dateupdated,endeffdt,status) 
        value("${code}","${firstname}","${lastname}","${email}","${gender}","${hobbies}","${photo}","${country}","${dateadded}","${dateupdated}","${endeffdt}","A")`
        const ans = await queryRunner(sqlQuery);
        res.status(200).send("ans");
    } catch (err) {
        res.status(400).send(err);
        console.log(err)
    }
})

//SHOW USER
app.get("/showuser", async (req, res) => {
    try {
        const sqlQuery = `select * from vishal_users where status = "A" `
        const ans = await queryRunner(sqlQuery);
        res.status(200).send(ans);
    } catch (err) {
        res.status(400).send(err);
    }
})

//Update User
app.get("/getuser", async (req, res) => {
    try {
        console.log("in server")
        const code = req.query.code;
        console.log(code);
        const sqlQuery = `select * from vishal_users
        where code = "${code}"`
        const ans = await queryRunner(sqlQuery);
        res.status(200).send(ans);

    } catch (err) {
        res.status(400).send(err);
        console.log(err)
    }
})
app.get("/getImage/:id", async (req, res) => {
  res.set("Content-Type", "image/png");
  const data = fs.readFileSync(`./images/${req.params.id}`);
  res.send(data);
});

app.post('/updatesetdata', async (req, res) => {
    const code = req.body.code;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const gender = req.body.gender;
    const hobbies = req.body.hobbies;
    const photo = req.body.photo;
    const country = req.body.country;
    const dispstatus = req.body.dispstatus;
    let updateddate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

    try {
        const sqlQuery = `update vishal_users set firstname = "${firstname}", lastname = "${lastname}",email = "${email}", gender = "${gender}", hobbies = "${hobbies}", photo = "${photo}",country = "${country}", dispstatus = "${dispstatus}", dateupdated = "${updateddate}" where code="${code}"`
        const ans = await queryRunner(sqlQuery);
        res.status(200).send(ans);
    } catch (err) {
        res.status(400).send(err);
        console.log(err)
    }
})

//DELETE user
app.delete("/userdelete", async (req, res) => {
    try {
        const code = req.query.code;
        const sqlquery = `update vishal_users set status= "i" where code = "${code}"`
        const ans = await queryRunner(sqlquery);
        res.status(200).send("ans");
    }
    catch (err) {
        res.status(400).send(err);
        console.log(err)
    }
})

app.get("/changestatus", async (req, res) => {
    try {
        const code = req.query.code;
     
        let date = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
      
        const sqlquery = `update vishal_users set dispstatus= "Inactive" , dateupdated = "${date}"  where code = "${code}"`
 
      
        
        
        const ans = await queryRunner(sqlquery);
        // const sqlquery2 = `update vishal_users set dispstatus= "Active" where code = "${code}"`
        // const ans2 = await queryRunner(sqlquery2);
        res.status(200).send("ans");
    }
    catch (err) {
        res.status(400).send(err);
        console.log(err)
    }
})

app.get("/sortdata", async (req, res) => {
    try {
        const sort = req.query.sort;
        
        
        
        const sqlquery = `select * from vishal_users order by ${sort}`
        console.log("query" ,sqlquery)
        const ans = await queryRunner(sqlquery);
        // const sqlquery2 = `update vishal_users set dispstatus= "Active" where code = "${code}"`
        // const ans2 = await queryRunner(sqlquery2);
        res.status(200).send(ans);
        
    }
    catch (err) {
        res.status(400).send(err);
        console.log(err)
    }
})



app.get("/filterdata", async(req,res) => {

    try{
    const searchvalue = req.query.searchdata;
    const hobbies  = req.query.hobbies;
    const gender = req.query.gender;
    console.log(req.query);
    const dispstatus = req.query.dispstatus;

    let sqlquery = ``;
    if(searchvalue != "" && searchvalue)
    {
            sqlquery = sqlquery + ` where code like "%${searchvalue}%" or firstname like "%${searchvalue}%"  or lastname like "%${searchvalue}%" or email like "%${searchvalue}%"`
    }
    if(hobbies != "" && hobbies)
    {
        if(sqlquery==""){
            sqlquery = sqlquery + ` where hobbies like "%${hobbies}%"`
        }else{
            sqlquery = sqlquery + ` and hobbies  like "%${hobbies}%"  `
        }
    }
    if(gender != "" && gender)
    {   
        if(sqlquery==""){
            sqlquery = sqlquery + ` where gender = "${gender}" `
        }else{
            sqlquery = sqlquery + ` and gender = "${gender}"  `
        }
        
    }
    if(dispstatus != "" && dispstatus)
    {
        if(sqlquery==""){
            sqlquery = sqlquery + ` where dispstatus = "${dispstatus}" `
        }else{
            sqlquery = sqlquery + ` and dispstatus = "${dispstatus}"  `
        }
        
    }
    let sqlquery2 = `select * from vishal_users  `+sqlquery;
    console.log(sqlquery2)
    const ans  = await queryRunner(sqlquery2);
    res.status(200).send(ans);
    console.log(ans)

    }
    catch(err){
        res.status(400).send(err);
        console.log(err);
    }
} )



app.listen(8000, () => {
    console.log("User App is listening on Port 8000")
})
