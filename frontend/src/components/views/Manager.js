import {useContext, useEffect, useState} from "react";
import {LanguageContext} from "../../App";

export default function Manager() {
    const [ isAck, setIsAck ]  = useState(false);
    const [ is403, setIs403 ] = useState(false);
    const { t } = useContext(LanguageContext)

    useEffect(() => {
        async function getManagerContent() {
            try {
                const response = await fetch(`http://localhost:8080/api/manager`, {
                    method: "GET",
                    headers: {
                        "Authorization": localStorage.getItem("token")
                    }
                })

                if (response.status === 200) {
                    setIsAck(true)
                } else if (response.status === 403) {
                    setIs403(true)
                }

            } catch (err) {
                console.error(err)
            }
        }

        getManagerContent()
    }, []);

    return (
        <div>
            {
                isAck
                    ? <p>{t("hello-manager-text")}</p>
                    : is403
                        ? <p>{t("not-manager-403-text")}</p>
                        : <p>{t("not-manager-400-text")}</p>


            }
        </div>

    );
}