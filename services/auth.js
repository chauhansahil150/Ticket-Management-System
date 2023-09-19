const isLogin = async (req, res, next) => {
    try {
        if (req?.session.user) { }
        else {
            res?.status(200).redirect("/login")
            return;
        }
        next();
    } catch (error) {
        console.log('%cauth.js line:8 object', 'color: #007acc;', error);
    }
}
const isLogout = async (req, res, next) => {
    try {
        if (req?.session.user) { 
            res?.status(200).redirect("/")
        }
        next();
    } catch (error) {
        console.log('%cauth.js line:8 object', 'color: #007acc;', error);
    }
}
const isAdmin = async (req, res, next) => {
    try {
        if (req?.session.user.role=='admin') { 
        }else{
            res.end("unauthorized access");
            return;
        }
        next();
    } catch (error) {
        console.log('%cauth.js line:8 object', 'color: #007acc;', error);
    }
}
module.exports = {
    isLogin,
    isLogout,
    isAdmin,

}