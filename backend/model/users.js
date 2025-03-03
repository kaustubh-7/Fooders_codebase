import mongoose from "mongoose";
import { randomBytes, createHmac } from "crypto";


const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {  //Salt is a random string of characters added to a password before hashing to make each hash unique.
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageURL: {
        type: String,
        default: "/images/default.svg",
    },
   
}, { timestamps: true });

//HMAC (Hash-based Message Authentication Code) is a cryptographic technique that ensures both data integrity and authentication using a secret key.

userSchema.pre("save", function(next){
    const user = this;

    if(!user.isModified("password")) return;

    const salt = randomBytes(16).toString('hex'); //This line generates a random salt for password hashing and then converts that 16 bits to hex form.
    const hashedPassword = createHmac("sha256", salt) //creates a hash code using sha256 algo and salt as secret key.
        .update(user.password + salt)//updates the password
        .digest("hex");//.digest("hex") converts the hashed password into a hexadecimal string.

    this.salt = salt;
    this.password = hashedPassword;

    next(); //next is a callback function that tells Mongoose to proceed to the next middleware or complete the operation
});

const User = mongoose.model("user", userSchema);

export default User;