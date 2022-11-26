import { useEffect } from "react";
import { Button, Card, CardBody, CardHeader } from 'reactstrap';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function TransactionSuccess(props) {
    const { walletId, newWalletClicked } = props;
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (newWalletClicked) {
            navigate('/');
        }
    })
    
    return (
        <Card className="card-success">
            <CardHeader className="card-header-success">
                <div>Transaction Successful</div>
            </CardHeader>
            <CardBody>
                <div className="text-center" style={{ cursor: 'pointer' }}>
                    <p>Transaction Id: {location.state.transactionId}</p>
                    <p>Balance: {location.state.balance}</p>
                    <p><Button color="warning" style={{ outline: 'none', boxShadow: 'none', fontSize: "16px" }} onClick={() => navigate('/')}>Create Transactions</Button></p>
                    <p><u><a href={`/transactions?walletId=${walletId}`}>View Transaction List</a></u></p>
                </div>
            </CardBody>
        </Card>
    )
}

export default TransactionSuccess;