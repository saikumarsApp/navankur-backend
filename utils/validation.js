const validation = require("validator");

const validateUserData = (req) => {
    const {userName, email, password} = req.body;
        if (!userName){
            throw new Error("Please Enter firstname and lastname");
        }
        else if (!validation.isEmail(email)){
            throw new Error("Please Enter valid email address");
        }else if (!validation.isStrongPassword(password)){
            throw new Error("Please Enter Strong password");
        }
}
module.exports = {validateUserData}