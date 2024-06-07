import { Outlet, useNavigate } from "react-router-dom"
import { checkAccount } from "./network";
import { useEffect } from "react";


export const AdminRoute = () => {
    const navigate = useNavigate();
    const isAdmin = () => {
        checkAccount(res => {
            if (res.response.type === 1) {
                return true
            } else {
                navigate('/')
            }
        })
    }

    useEffect(() => {
        isAdmin()
    }, [])

    return (
        <Outlet />
    )
}

export const UserRoute = () => {
    const navigate = useNavigate();
    const isUser = () => {
        checkAccount(res => {
            if (res.response.type !== 1) {
                return true
            } else {
                navigate('/')
            }
        })
    }

    useEffect(() => {
        isUser()
    }, [])

    return (
        <Outlet />
    )

}