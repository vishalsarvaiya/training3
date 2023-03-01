import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'
import Navbar from './Navbar';

import { CSVLink } from "react-csv";
import Papa from "papaparse";

const Userdata = () => {

    const router = useRouter();
    const [userdata, setUserdata] = useState([]);
    const [pagerefresd, setpagerefresd] = useState(false)

    const [prevpage, setPrevpage] = useState(0);
    //for pagination
    const [length, setLength] = useState(0);
    const [total, setTotal] = useState(0);
    const [curPage, setCurPage] = useState(0);

    // //for csv file export and import
    const [csvdata, setCsvdata] = useState([]);
    const [csv2data, setCsv2data] = useState([]);


    // Allowed extensions for input file
    const allowedExtensions = ["csv"];
    const [error, setError] = useState("");
    const [file, setFile] = useState("");

    const [dispstatus, setDispstatus] = useState();

    const headers = [
        { label: "code", key: "code" },
        { label: "name", key: "firstname" },
        { label: "email", key: "email" },
        { label: "gender", key: "gender" },
        { label: "hobbies", key: "hobbies" },
        { label: "status", key: "status" },
        { label: "dateadded", key: "dateadded" },
        { label: "dateupdated", key: "dateupdated" },
    ];

    const DataToCSV = (userdata) => {
        let tempAns = userdata.map((item) => {
            console.log(item);
            const json = {};
            json.code = item.code;
            json.firstname = item.firstname + "  " + item.lastname;
            json.email = item.email;
            json.gender = item.gender;
            json.hobbies = item.hobbies;
            json.photo = item.photo;
            json.status = item.status == "A" ? "Active" : "Inactive";
            json.dateadded = item.dateadded;
            json.country = item.country;
            json.dateupdated = item.dateupdated;
            return json;
        });
        setCsvdata(tempAns);
    };

    useEffect(() => {
        showuser();
        console.log(userdata.dispstatus)
        setLength()
    }, []);

    useEffect(() => {
        DataToCSV(userdata);
    }, [userdata])

    useEffect(() => {
        setUserdata(csv2data);
    }, [csv2data])

    useEffect(() => {
        showuser();
    }, [pagerefresd])

    const handleupdate = (code) => {
        localStorage.setItem("tempcode", code);
        // navigate('/updateuser');
        router.push("/Users/Updateuser")
        console.log("update clicked")
    }

    const showuser = async () => {
        try {
            const res = await axios.get("/api/user", { params: { for: "showuser" } });
            console.log(res.data);
            setUserdata(res.data);
            setLength(res.data.length)
            setTotal(Math.ceil(res.data.length / 3));
            console.log("leng", length);
            console.log("userdata", userdata);
        }
        catch (err) {
            console.log(err);
        }
    }

    const handledelete = async (code) => {
        try {
            const res = await axios.delete("/api/user", { params: { code, for: 'userdelete' } })
            console.log(res.data);
            setpagerefresd(!pagerefresd);
        }
        catch (err) {
            console.log(err);
        }
    }

    const handelstatus = async (code) => {
        try {
            const res = await axios.get("api/user", { params: { code, dispstatus: dispstatus, for: 'changestatus' } })
            console.log("status clicked");
            console.log(dispstatus);
            setpagerefresd(!pagerefresd);
        }
        catch (err) {
            console.log(err);
        }
    }

    const handleview = async (code) => {
        localStorage.setItem("tempcode", code);
        router.push('/Users/Viewuser')
        console.log("view clicked")
    }

    const findImageName = (tData) => {
        console.log(tData);
        if (tData) {
            let ansss = tData.split('/');
            ansss = ansss[ansss.length - 1];
            return ansss;
        } else {
            return "download.png"
        }
    }

    const changeSubmitData = (tData) => {
        setUserdata(tData)
    }

    const changeSorteddata = (tData) => {
        // console.log("inside",tdata)
        setUserdata(tData)
    }

    const handleFileChange = (e) => {
        setError("");
        // Check if user has entered the file
        if (e.target.files.length) {
            const inputFile = e.target.files[0];
            // Check the file extensions          
            const fileExtension = inputFile?.type.split("/")[1];
            if (!allowedExtensions.includes(fileExtension)) {
                setError("Please input a csv file");
                return;
            }
            // If input type is correct set the state
            setFile(inputFile);
        }
    };

    const handleParse = () => {
        // setFile(e.target.files[0]);
        if (!file) return setError("Enter a valid file");
        // Initialize a reader
        const reader = new FileReader();

        // Event listener on reader when the file
        // loads, we parse it and set the data.
        reader.onload = async ({ target }) => {
            const csv = Papa.parse(target.result, {
                header: true,
                skipEmptyLines: true,
                complete: function (results) {
                    console.log("parsed", results.data)

                    setCsv2data(results.data)
                    const resultdata = results.data;
                    const importeddata = axios.post("/api/user", { resultdata, for: 'import' });
                    console.log(importeddata);
                },
            });
            // const parsedData = csv?.data;
            // const columns = Object.keys(parsedData[1]);
            // setCsv2data(columns);
        };
        reader.readAsText(file);
    };

    return (

        <>


            <Navbar
                changeSubmitData={changeSubmitData}
                changeSorteddata={changeSorteddata} />
            <div style={{ margin: "10px", display: "flex" }}>
                <span>
                    <CSVLink
                        filename={"Userdata.csv"}
                        className="btn btn-primary"
                        // headers={headers}
                        data={userdata}>
                        EXPORT DATA
                    </CSVLink>
                </span>
                <span style={{ marginLeft: "15px" }} >
                    <label htmlFor="csvInput" style={{ display: "block" }}>
                        Enter CSV File
                    </label>
                    <input
                        onChange={handleFileChange}
                        id="csvInput"
                        name="file"
                        type="File"
                        accept=".csv"
                    />
                    <button className='btn btn-success'
                        onClick={handleParse}
                    >IMPORT</button>
                    <div style={{ color: "red" }}>
                        {error ? ("import error", error) : console.log("ok")}
                    </div>
                </span>
            </div>


            <table className="table">
                <thead className="thead-dark">
                    <tr>
                        <th>Code </th>
                        <th>Photo</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Gender</th>
                        <th>Hobbies</th>
                        <th>dateadded</th>
                        <th>Country</th>
                        <th>Status</th>
                        <th>Actions</th>
                        <th>
                            <button
                                className="btn btn-success"
                                style={{ width: "60px" }}
                                onClick={() => {
                                    router.push("/Users/User_form")
                                }}>
                                ADD
                            </button>
                        </th>
                    </tr>
                </thead>

                {userdata ? (
                    <>
                        {userdata.slice(curPage * 3, curPage * 3 + 3).map((udata, index) => (
                            <tbody>
                                <tr>
                                    <td>{udata.code} </td>
                                    <td>
                                        <img
                                            src={`Images/${findImageName(udata.photo)}`}
                                            style={{ height: "100px" }} />
                                    </td>
                                    <td>  {udata.firstname} {udata.lastname} </td>
                                    <td>{udata.email} </td>
                                    <td> {udata.gender}</td>
                                    <td> {udata.hobbies}</td>
                                    <td> {udata.dateadded}</td>
                                    <td> {udata.country}</td>
                                    <td>
                                        <p
                                            onClick={(e) => {
                                                handelstatus(udata.code);
                                                setDispstatus(udata.dispstatus);
                                            }}>
                                            {udata.dispstatus}
                                        </p>
                                    </td>
                                    <td style={{ display: "flex" }}>
                                        <button
                                            className="btn btn-info"
                                            style={{ marginRight: "10px", color: "white" }}
                                            onClick={(e) => {
                                                handleview(udata.code);
                                            }}
                                        >
                                            VIEW
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            style={{ marginRight: "10px" }}
                                            onClick={(e) => {
                                                handleupdate(udata.code);
                                            }}
                                        >
                                            UPDATE
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={(e) => {
                                                handledelete(udata.code);
                                            }}
                                        >
                                            DELETE
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        ))}
                    </>
                )
                    :
                    (
                        <tr>
                            <td>No Data</td>
                        </tr>
                    )}
            </table>

            <div style={{ justifyContent: "space-between", display: "flex" }}>
                <div>
                    <button disabled={curPage == 0} style={{ margin: "10px" }}
                        onClick={() => {
                            setCurPage(curPage - 1)
                        }}>Prev</button>
                </div>

                {"Page No: " + (curPage + 1)}

                <div>
                    <button disabled={(curPage + 1) == total}
                        onClick={() => {
                            setCurPage(curPage + 1)
                            console.log(curPage, total)
                        }}>Next</button>
                </div>
            </div>
        </>
    );
}

export default Userdata