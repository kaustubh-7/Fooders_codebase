import dotenv from 'dotenv';
dotenv.config();

import jwt from "jsonwebtoken";


function createToken(user){
    console.log("creating token");
    const payload = {
        fullName: user.fullName,
        _id: user._id,
        email: user.email,
        address: user.address
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    console.log(token);
    return token;
}

function validateToken(token){
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log(payload);
    return payload;
}

export { createToken, validateToken };