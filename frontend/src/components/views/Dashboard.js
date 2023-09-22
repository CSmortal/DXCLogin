import {useContext} from "react"
import {useNavigate} from "react-router-dom";
import "../../css/Dashboard.css"
import {AuthContext, LanguageContext, UserDetailsContext} from "../../App";


export default function Dashboard() {

    const { setIsAuth } = useContext(AuthContext)
    const { setIsManager, isManager, name, email } = useContext(UserDetailsContext)
    const { t } = useContext(LanguageContext)

    const navigate = useNavigate()


    const handleManagerLinkClick = () => {
        if (isManager) {
            navigate("/manager")
        }
    }

    const handleLogout = async () => {
        const response = await fetch("http://localhost:8080/auth/logout", {
            method: "POST"
        })

        if (response.status === 200) {
            setIsAuth(false)
            setIsManager(false)
            navigate("/login", {replace: true})
            localStorage.removeItem("token")
        }
    }

    return (
        <>
            <h1 className="title">{t("dashboard-title")}</h1>
            <div className="dashboard-container">

                <button onClick={handleLogout}>{t("logout-btn-text")}</button>

                <p className="role">{`${t("role")}: ${isManager ? t("role-manager") : t("role-user")}`}</p>
                <p className="name">{`${t("name")}: ${name}`}</p>
                <p className="email">{`${t("email")}: ${email}`}</p>

                {isManager && <a className="restrictedLink" onClick={handleManagerLinkClick}>{t("restricted-link-text")}</a>}

            </div>
        </>

    );
}