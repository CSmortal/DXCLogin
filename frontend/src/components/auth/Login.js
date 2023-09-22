import {Fragment, useContext, useState} from "react";
import {Link} from "react-router-dom";
import {AuthContext, LanguageContext, UserDetailsContext} from "../../App";
import "../../css/Login.css"

export default function Login() {
    const { setIsAuth } = useContext(AuthContext)
    const { setIsManager, setEmail, setName } = useContext(UserDetailsContext)
    const { t } = useContext(LanguageContext)
    const [ isRegistered, setIsRegistered ] = useState(true)
    const [ inputs, setInputs ] = useState({
        email: "",
        password: ""
    })

    const { email, password } = inputs;

    const onSubmitForm = async (e) => {
        e.preventDefault()

        const body = { email, password }

        try {
            const response = await fetch(`http://localhost:8080/auth/login`
                , {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(body)
                }).then(res => res.json())

            if (response && response.success) {
                localStorage.setItem("token", response.token)
                setIsAuth(true) // responsible for routing to the next route from login screen
                setIsManager(response.manager)
                setEmail(response.email)
                setName(response.name)
            } else {
                setIsRegistered(false)
            }
        } catch (error) {
            setIsRegistered(false)
        }
    }


    function onInputChange(e) {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className="login-container">

            <div className="titleAndIconContainer">
                <h1 className="login-title">{t("login-title")}</h1>
            </div>

            <form onSubmit={onSubmitForm} className="login-form">
                <input
                    className="login-input"
                    type="text"
                    name="email"
                    value={email}
                    onChange={e => onInputChange(e)}
                    placeholder={t("email-placeholder")}
                />
                <input
                    className="login-input"
                    type="password"
                    name="password"
                    value={password}
                    onChange={e => onInputChange(e)}
                    placeholder={t("password-placeholder")}
                />
                <button className="login-button">{t("login-button-text")}</button>
            </form>

            { !isRegistered && <p className="login-failed-text">{t("login-failed-text")}</p> }

            <Link to="/register" className="register-link">{t("register-link")}</Link>
        </div>
    );
}