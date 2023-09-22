import {useContext} from "react";
import {LanguageContext} from "../App";

export default function LanguageSwitcher() {
    const { t, language, setLanguage, handleLanguageChange } = useContext(LanguageContext)
    const handleClick = (e) => {
        handleLanguageChange(e.target.value)

    }

    return (
        <div>
            <label htmlFor="language">{t("select-language-label")}</label>
            <select id="language" value={language} onChange={handleClick}>
                <option value="english">{t("english-selection")}</option>
                <option value="chinese">{t("chinese-selection")}</option>
            </select>
        </div>
    )
}