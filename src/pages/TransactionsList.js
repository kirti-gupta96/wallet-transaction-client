import { useState, useEffect } from "react";
import querystring from 'querystring';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, CardFooter, Button } from 'reactstrap';
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

function TransactionsList(props) {
    const { newWalletClicked } = props;
    const qs = querystring.parse(window.location.search.substr(1));
    const { walletId } = qs;
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [totalPages, setTotalPages] = useState([]);
    const [error, setError] = useState('');
    const [sort, setSort] = useState({});
    const toolTipIcon = <i className="fa fa-info-circle text-primary pl-1" style={{ cursor: 'pointer', fontSize: 16 }} />;

    useEffect(() => {
        getTransactionsList(1, 5);
    }, [sort]);

    useEffect(() => {
        if (newWalletClicked) {
            navigate('/');
        }
    })

    const getTransactionsList = async (page, sizePerPage) => {
        try {
            let limit = sizePerPage;
            let skip = (page - 1) * sizePerPage;
            let sortKey = Object.keys(sort)[0];
            let sortValue = sort[sortKey];
            const options = {
                method: "GET",
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                url: `https://wallet-transaction-app.herokuapp.com/transactions?walletId=${walletId}&skip=${skip}&limit=${limit}&page=${page}&sortKey=${sortKey}&sortValue=${sortValue}`
            }
            const res = await axios(options);
            setTotalPages(res.data.totalPages);
            setTransactions(res.data.data);
        } catch (error) {
            setError(error.message || "Error while fetching transactions");
        }
    }

    const onSortChange = (sortName, sortOrder) => {
        let sort = {};
        if (sortName && sortOrder) {
            sort = {
                [sortName]: sortOrder
            };
        }
        setSort(sort);
    }


    let options = {
        onPageChange: (page, sizePerPage) => getTransactionsList(page, sizePerPage),
        sizePerPage: 5,
        sizePerPageList: [{
            text: '10', value: 10
        }, {
            text: '50', value: 50
        }, {
            text: '100', value: 100
        }, {
            text: '200', value: 200
        }],
        onSortChange: onSortChange,
    }

    function dateFormatter(cell, row) {
        let value = cell && moment(cell).format("DD-MMM-YYYY hh:mm A");
        return value;
    }

    function rupeeFormatter(cell, row) {
        let rupeeIndianLocale = Intl.NumberFormat('en-IN');
        return ` &#x20b9; ${rupeeIndianLocale.format(cell)}`;
    }

    return (
        <>
            {error && <div style={{ color: "black", marginTop: '10px', marginBottom: '30px' }}>
                <div class="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>}
            <Card className="transactions-list-card">
                <CardHeader style={{ backgroundColor: "#74D29F", fontSize: "18px", fontWeight: "500" }}>
                    <div>Transactions Details {toolTipIcon} </div>
                </CardHeader>
                <CardBody>
                    <BootstrapTable
                        data={transactions}
                        striped
                        hover
                        condensed
                        pagination
                        exportCSV={true}
                        options={options}
                        remote={true}
                        fetchInfo={{ dataTotalSize: totalPages }}
                    >
                        <TableHeaderColumn dataField="id" isKey width="20%" dataSort> Transaction ID</TableHeaderColumn>
                        <TableHeaderColumn dataField="walletId" width="20%" dataSort>Wallet Id</TableHeaderColumn>
                        <TableHeaderColumn dataField="amount" width="20%" dataFormat={rupeeFormatter} dataSort>Amount</TableHeaderColumn>
                        <TableHeaderColumn dataField="balance" width="20%" dataFormat={rupeeFormatter} dataSort>Balance</TableHeaderColumn>
                        <TableHeaderColumn dataField="createdAt" width="20%" dataFormat={dateFormatter} dataSort>Date</TableHeaderColumn>
                    </BootstrapTable>
                </CardBody>
                <CardFooter>
                    <Button color="primary" style={{ fontSize: "16px", float: "left" }} onClick={() => navigate('/')}>Back</Button>
                </CardFooter>
            </Card>
        </>
    );
}

export default TransactionsList; 
