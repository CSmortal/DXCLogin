import {Fragment, useContext, useState} from "react";
import {Link} from "react-router-dom"
import {AuthContext, LanguageContext, UserDetailsContext} from "../../App";
import "../../css/Register.css"

export default function Register() {
    const { setIsAuth } = useContext(AuthContext);
    const { setIsManager, setEmail, setName } = useContext(UserDetailsContext)
    const { t } = useContext(LanguageContext)
    const [ isRegistered, setIsRegistered ] = useState(true)
    const [ manager, setManager ] = useState(false)
    const [ inputs, setInputs ] = useState({
        name: "",
        email: "",
        password: "",
    })

    const { name, email, password } = inputs;

    function onInputChange(e) {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        })
    }

    function onRadioClick(e) {
        setManager(prevValue => !prevValue)
    }

    async function onSubmitForm(e) {
        e.preventDefault();

        if (name.length <= 1 || email.length <= 5 || password.length <= 3) {
            return;
        }


        try {
            const response = await fetch(`http://localhost:8080/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...inputs,
                    manager: manager
                })
            }).then(res => res.json())

            if (response && response.success) {
                localStorage.setItem("token", response.token)
                setIsAuth(true)
                setIsManager(manager)
                setEmail(response.email)
                setName(response.name)
            } else {
                setIsRegistered(false)
            }
        } catch (error) {
            setIsRegistered(false)
        }
    }


    return (
        <div className="register-container">
            <h1 className="titleRegister">{t("register-title")}</h1>

            <form className="register-form" onSubmit={onSubmitForm}>
                <input
                    className="register-form-input"
                    type="text"
                    name="name"
                    value={name}
                    placeholder={t("name-placeholder")}
                    onChange={e => onInputChange(e)}
                />
                <input
                    className="register-form-input"
                    type="text"
                    name="email"
                    value={email}
                    placeholder={t("email-placeholder")}
                    onChange={e => onInputChange(e)}
                />
                <input
                    className="register-form-input"
                    type="password"
                    name="password"
                    value={password}
                    placeholder={t("password-placeholder")}
                    onChange={e => onInputChange(e)}
                />

                <label className="register-form-label">
                    <input
                        type="radio"
                        checked={manager}
                        onClick={onRadioClick}
                    />
                    {t("register-as-manager")}
                </label>
                <button className="register-form-register-btn">{t("register-button-text")}</button>
            </form>
            <p className="validation-msg">{t("register-validation-msg")}</p>
            { !isRegistered && <p className="register-failed-text">{t("register-failed-text")}</p> }

            <Link to="/login">{t("login-link")}</Link>

        </div>

    )
}