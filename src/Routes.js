import { Outlet, useNavigate } from "react-router-dom"
import { checkAccount } from "./network";
import { useEffect, useState } from "react";
import Empty_modal from "./components/Modal/Empty_modal";
import Error_empty from "./components/Modal/Error_empty";


export const AdminRoute = () => {
    const [errorEmptyActive, setErrorEmptyActive] = useState(false);
    const [codeText, setCodeText] = useState('');
    const [textError, setTextError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        isAdmin()
    }, [])
    const isAdmin = () => {
        checkAccount(res => {
            if (res.response.type === 1) {
                return true
            } else {
                navigate('/')
            }
        }).catch((error) => {
            setTextError(error.message);
            setCodeText(error.code);
            setErrorEmptyActive(true);
        });
    }



    return (
        <><Outlet />
            <Error_empty active={errorEmptyActive} text={textError} codeText={codeText} />

        </>
    )
}

export const UserRoute = () => {
    const [urlActive, setUrlActive] = useState(false);
    const [errorEmptyActive, setErrorEmptyActive] = useState(false);
    const [codeText, setCodeText] = useState('');
    const [textError, setTextError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        isUser()
    }, [])
    const isUser = () => {

        checkAccount(res => {
            if (res.response.type !== 1) {
                return true
            } else {
                navigate('/')
            }
        }).catch((error) => {
            setTextError(error.message);
            setCodeText(error.code);
            setErrorEmptyActive(true);
        });
    }



    return (
        <><Outlet />
            <Error_empty active={errorEmptyActive} text={textError} codeText={codeText} />

        </>
    )

}