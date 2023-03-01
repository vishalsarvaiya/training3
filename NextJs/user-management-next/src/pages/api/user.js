import { resolve } from "styled-jsx/css";
import Viewuser from "../Users/Viewuser";
import moment from "moment";

const { queryRunner } = require("./Database/DB");

export default async function User(req, res) {
  try {
    if (req.method == "GET") {
      if (req.query.for == "showuser") {
        const sqlQuery = `select * from vishal_users where status = "A" `;
        const ans = await queryRunner(sqlQuery);
        // console.log("inside get request ", ans);
        res.status(200).send(ans);
      } else if (req.query.for == "getuser") {
        const ans = await getuser(req.query);
        res.status(200).send(ans);
      } else if (req.query.for == "filterdata") {
        const ans = await filterdata(req.query);
        res.status(200).send(ans);
      }
      else if (req.query.for == "sortdata") {
        // console.log("server sort")
        const ans = await sortdata(req.query);
        res.status(200).send(ans);
      }
      else if (req.query.for == "changestatus") {
        const ans = await changestatus(req.query);
        res.status(200).send(ans);
      }
    } else if (req.method == "POST") {
      if (req.body.for == "updatesetdata") {
        const ans = await updatesetdata(req.body);
        res.status(200).send(ans);
      } else if (req.body.for == "adduser") {
        // console.log(req.body);
        const ans = await adduser(req.body);
        res.status(200).send(ans);
      }
      else if (req.body.for == 'import') {
        const ans = await importdata(req.body);
        res.status(200).send(ans);
      }
    } else if (req.method == "DELETE") {
      const ans = await userdelete(req.query);
      res.status(200).send(ans);
    }
  } catch (err) {
    console.log("errr : ", err);
    res.status(400).send(err);
  }
}

const getuser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log("in server");
      const code = data.code;
      // console.log(code);
      const sqlQuery = `select * from vishal_users where code = "${code}"`;
      const ans = await queryRunner(sqlQuery);
      resolve(ans);
    } catch (err) {
      reject(err);
    }
  });
};

const adduser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const code = data.code;
      const firstname = data.firstname;
      const lastname = data.lastname;
      const email = data.email;
      const gender = data.gender;
      const hobbies = data.hobbies;
      const photo = `/public/Images/${data.photo}`;
      const country = data.country;

      let dateadded = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
      let dateupdated = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
      let endeffdt = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

      const sqlQuery = `insert into vishal_users (code,firstname,lastname,email,gender,hobbies,photo,country,dateadded,dateupdated,endeffdt,status) values ("${code}","${firstname}","${lastname}","${email}","${gender}","${hobbies}","${photo}","${country}","${dateadded}","${dateupdated}","${endeffdt}","A")`;
      const ans = await queryRunner(sqlQuery);
      resolve(ans);
    } catch (err) {
      console.log("add error", err);
      reject(err);
    }
  });
};

const updatesetdata = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log("in server");
      const code = data.code;
      const firstname = data.firstname;
      const lastname = data.lastname;
      const email = data.email;
      const gender = data.gender;
      const hobbies = data.hobbies;
      const photo = data.photo;
      const country = data.country;
      const dispstatus = data.dispstatus;
      let updateddate = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

      const sqlQuery = `update vishal_users set firstname = "${firstname}", lastname = "${lastname}",email = "${email}", gender = "${gender}", hobbies = "${hobbies}",photo = "${photo}",country = "${country}", dispstatus = "${dispstatus}", dateupdated = "${updateddate}" where code="${code}"`;
      const ans = await queryRunner(sqlQuery);
      resolve(ans);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

const userdelete = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const code = data.code;
      const sqlquery = `update vishal_users set status= "i" where code = "${code}"`;
      const ans = await queryRunner(sqlquery);
      // res.status(200).send("ans");
      resolve(ans);
    } catch (err) {
      console.log("delete error", err);
      reject(err);
    }
  });
};


const importdata = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let dateadded = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
      let dateupdated = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
      let endeffdt = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
      console.log(data.resultdata)
      const ans = data.resultdata;
      console.log(ans);
      ans.map(async (item) => {
        let code = item.code;
        const ans = await queryRunner(`select * from vishal_users where code="${code}"`)
        // console.log(item, " ", ans);
        if (ans.length > 0) {
          const sqlQuery = `update vishal_users set firstname = "${item.firstname}", lastname = "${item.lastname}",email = "${item.email}", gender = "${item.gender}", hobbies = "${item.hobbies}", photo = "${item.photo}",country = "${item.country}", dispstatus = "${item.dispstatus}", dateupdated = "${item.updateddate}" where code="${item.code}"`
          const ans = await queryRunner(sqlQuery);
          console.log(sqlQuery);
          console.log(ans);
        }
        if (ans.length == 0) {
          let sqlQuery = `Insert into vishal_users (code,firstname,lastname,email,gender,hobbies,photo,country,status,dateadded,dateupdated,endeffdt,dispstatus) values("${item.code}","${item.firstname}","${item.lastname}","${item.email}","${item.gender}","${item.hobbies}","${item.photo}","${item.country}","${item.status}","${dateadded}","${dateupdated}","${endeffdt}","${item.dispstatus}")`
          console.log(sqlQuery)
          const ans = await queryRunner(sqlQuery);
        }
      })
      resolve("data inserted");
    }
    catch (err) {
      console.log(err)
      reject(err);
    }
  });
};


const sortdata = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sort = data.sort;
      const sqlquery = `select * from vishal_users order by ${sort}`;
      // console.log("query" ,sqlquery)
      const ans = await queryRunner(sqlquery);
      // res.status(200).send(ans);
      resolve(ans);
    } catch (err) {
      // res.status(400).send(err);
      console.log(err)
      reject(err);
    }
  });
};

const changestatus = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const code = data.code;
      const status = data.dispstatus;
      // console.log(status,"in status server")  
      let date = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
      if (status == "Active") {
        const sqlquery = `update vishal_users set dispstatus= "Inactive" , dateupdated = "${date}"  where code = "${code}"`
        const ans = await queryRunner(sqlquery);
        resolve(ans)
      }
      if (status == "Inactive") {
        const sqlquery = `update vishal_users set dispstatus= "Active" , dateupdated = "${date}"  where code = "${code}"`
        const ans = await queryRunner(sqlquery);
        resolve(ans)
      }

      // const sqlquery = `update vishal_users set dispstatus= "Inactive" , dateupdated = "${date}"  where code = "${code}"`
      // const ans = await queryRunner(sqlquery);
      // resolve(ans)
    } catch (err) {
      // res.status(400).send(err);
      console.log(err)
      reject(err);
    }
  });
};

const filterdata = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const searchvalue = data.searchdata;
      const hobbies = data.hobbies;
      const gender = data.gender;
      // console.log(data);
      const dispstatus = data.dispstatus;

      let sqlquery = ``;
      if (searchvalue != "" && searchvalue) {
        sqlquery =
          sqlquery +
          ` where code like "%${searchvalue}%" or firstname like "%${searchvalue}%"  or lastname like "%${searchvalue}%" or email like "%${searchvalue}%"`;
      }
      if (hobbies != "" && hobbies) {
        if (sqlquery == "") {
          sqlquery = sqlquery + ` where hobbies like "%${hobbies}%"`;
        } else {
          sqlquery = sqlquery + ` and hobbies  like "%${hobbies}%"  `;
        }
      }
      if (gender != "" && gender) {
        if (sqlquery == "") {
          sqlquery = sqlquery + ` where gender = "${gender}" `;
        } else {
          sqlquery = sqlquery + ` and gender = "${gender}"  `;
        }
      }
      if (dispstatus != "" && dispstatus) {
        if (sqlquery == "") {
          sqlquery = sqlquery + ` where dispstatus = "${dispstatus}" `;
        } else {
          sqlquery = sqlquery + ` and dispstatus = "${dispstatus}"  `;
        }
      }
      let sqlquery2 = `select * from vishal_users  ` + sqlquery;
      // console.log(sqlquery2);
      const ans = await queryRunner(sqlquery2);
      resolve(ans);
      // res.status(200).send(ans);
      // console.log(ans);
    } catch (err) {
      // console.log(err);
      reject(err);
    }
  });
};





// const getuser = async(data) => {
//         try {
//             console.log("in server")
//             const code = req.query.code;
//             console.log(code);
//             const sqlQuery = `select * from vishal_users where code = "${code}"`;
//             const ans = await queryRunner(sqlQuery);
//             // resolve(ans);
//             res.send(ans);
//         } catch (err) {
//             res.status(400).send(err);
//             console.log(err)
//         }

// };
