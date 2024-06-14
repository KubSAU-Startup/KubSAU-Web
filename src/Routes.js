import { Outlet, useNavigate } from "react-router-dom"
import { checkAccount, getTextError } from "./network";
import { useEffect, useState } from "react";
import Error_empty from "./components/Modal/Error_empty";
import Error_modal from "./components/Modal/Error_modal";


export const AdminRoute = () => {
    const [errorEmptyActive, setErrorEmptyActive] = useState(false);
    const [codeText, setCodeText] = useState('');
    const [textError, setTextError] = useState('');
    const [errorActive, setErrorActive] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        isAdmin()
    }, [])
    const isAdmin = () => {
        checkAccount(res => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
            } else {
                if (res.response.type === 1) {
                    return true
                } else {
                    navigate('/')
                }
            }
        }).catch((error) => {
            setTextError(getTextError(error));
            setCodeText(error.code);
            setErrorEmptyActive(true);
        });
    }



    return (
        <><Outlet />
            <Error_empty active={errorEmptyActive} text={textError} codeText={codeText} />
            <Error_modal active={errorActive} setActive={setErrorActive} text={textError} setText={setTextError} />

        </>
    )
}

export const UserRoute = () => {
    const [errorEmptyActive, setErrorEmptyActive] = useState(false);
    const [codeText, setCodeText] = useState('');
    const [textError, setTextError] = useState('');
    const [errorActive, setErrorActive] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        isUser()
    }, [])
    const isUser = () => {

        checkAccount(res => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
            } else {
                if (res.response.type !== 1) {
                    if(res.response.selectedDepartmentId === null){
                        navigate('/user/UserChoice');
                    }else{
                        return true;
                    }
                } else {
                    navigate('/')
                }
            }

        }).catch((error) => {
            setTextError(getTextError(error));
            setCodeText(error.code);
            setErrorEmptyActive(true);
        });
    }



    return (
        <><Outlet />
            <Error_empty active={errorEmptyActive} text={textError} codeText={codeText} />
            <Error_modal active={errorActive} setActive={setErrorActive} text={textError} setText={setTextError} />

        </>
    )

}