const THEME_KEY = "theme.key";
export function getTheme(){
    try {
        const savedTheme = localStorage.getItem(THEME_KEY);
        return savedTheme === "dark" ? "dark" : "light";
    } catch(error){
        console.error("Nah, couln't read your saved theme!", error);
        return "light";
    }
}
export function applyTheme(theme){
    const validTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = validTheme;
    document.documentElement.style.colorScheme = validTheme;
    return validTheme;
}

export function setTheme(theme){
    const validTheme = applyTheme(theme);
    try{
        localStorage.setItem(THEME_KEY, validTheme);
        return true;
    } catch(error){
        console.error("Couldnot save theme: ", error);
        return false;
    }
}

applyTheme(getTheme());