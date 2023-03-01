import { IncomingForm } from 'formidable'
import { promises as fs } from 'fs'

var mv = require('mv');


export const config = {
    api: {
       bodyParser: false,
    }
};

export default async (req, res) => {    
  const data = await new Promise((resolve, reject) => {
     const form = new IncomingForm()
     
      form.parse(req, (err, fields, files) => {
          if (err) return reject(err)
          // console.log("form",fields, files)
          // console.log("form file",files.file.filepath)
          var oldPath = files.file.filepath;
          // console.log(oldPath)
          var newPath = `./public/Images/${files.file.originalFilename}`;
          mv(oldPath, newPath, function(err)
           {
          });
          res.status(200).json({ fields, files })
      })
  })  
}


// export default async function User(req, res) {

//     const file = req.files.file;
//     const filename = file.name;
//     console.log(filename);
//     file.mv(`./Images/${filename}`, (err) => {
//         if (err) {
//             console.log(err);
//             return res.status(400).send({ message: "File upload failed" });
//         }
//         res.status(200).send({ message: `./Images/${filename}`, code: 200 });
//     });
// }


// app.post("/userimage", async (req, res) => {
//     const file = req.files.file;
//     const filename = file.name;
//     console.log(filename)
//     file.mv(`./images/${filename}`, (err) => {
//         if (err) {
//             console.log(err);
//             return res.status(400).send({ message: "File upload failed" });
//         }
//         res.status(200).send({ message: `./images/${filename}`, code: 200 });
//     });
// });


// const userimage = (data) => {
//     return new Promise(async (resolve, reject) => {
//       try {
//         const file = data.file;
//         const filename = file.name;
//         console.log(filename);
//         file.mv(`./Images/${filename}`, (err) => {
//           if (err) {
//             console.log(err);
//             console.log("File upload failed")
//           }
//           res.status(200).send({ message: `./Images/${filename}`, code: 200 });
//           resolve(ans,{message: `./Images/${filename}`, code: 200 })
//         });
//       } catch (err) {
//         console.log(err);
//         reject(err);
//       }
//     });
//   };
  