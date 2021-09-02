import React, { useEffect, useState } from "react"
import {useHistory} from "react-router-dom";
import TableRow from "./table_row";
import "../../css/dashboard/history_table.css";

const HistoryTable = () => {
    const [tableData, setTableData] = useState([]);
    const [page, setPage] = useState(1);
    let history = useHistory();

    useEffect(() => {
        const fetchTableData = () => {
            const url = "/api/getHistory";
            const options = {
                headers : {
                    'Accept': 'application/json'
                },
                credentials: "include"
            };

            fetch(url, options).then(res => {
                 if (res.status === 200) {
                    return res.json()
                }
                history.push("/login");
            }).then(data => {
                let tableData = [];
                Object.keys(data).forEach((key) => {
                    tableData.push(data[key])
                })
                setTableData(tableData.reverse());
            }).catch(err => {
                console.log(err)
            })
        }

        fetchTableData();
    }, [history])

    const yyyymmdd = (date) => {
        const localDate = new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: 'Canada/Eastern'}));
        return localDate.toString().slice(0, 24);
    }

    const nextPage = () => {
        if (page < tableData.length/8) {
            setPage(page + 1)
        }
    }

    const prevPage = () => {
        if (page > 1) {
            setPage(page - 1)
        }
    }

    return (
        <div className="history_content">
            <div className="history_background">
                <div className="table_titles">
                    <span className="title">
                        Date
                    </span>
                    <span className="title">
                        Room Name
                    </span>
                    <span className="title">
                        Description
                    </span>
                    <span className="title">
                        Room Code
                    </span>
                </div>
                <hr className="history"/>
                {tableData.slice(page*8 - 8, page*8).map((entry, index) => {
                    let date = yyyymmdd(entry.date);
                    let desc = entry.description;

                    if (desc === undefined || desc.replace(" ", "") === "") {
                        desc = "N/A"
                    }
                    return (
                        <TableRow
                            date={date}
                            roomName={entry.roomName}
                            desc={desc}
                            link={entry.roomLink}
                            index={index}
                            key={index}
                        />
                    )
                })}
                <div className="history_control">
                    <input className="history_btn" type="button" value="Prev Page" onClick={prevPage}/>
                    <span className="page_indicator">
                        {page} / {Math.ceil(tableData.length/8)}
                    </span>
                    <input className="history_btn" type="button" value="Next Page" onClick={nextPage}/>
                </div>
            </div>
        </div>
    )
}

export default HistoryTable;