import { Schema, model } from 'mongoose';
import { randomBytes, createHmac } from 'crypto';
import { createToken } from '../util/auth.js';

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phNumber:{
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
    address: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        defualt: "USER",
    },
}, { timestamps: true });

//HMAC (Hash-based Message Authentication Code) is a cryptographic technique that ensures both data integrity and authentication using a secret key.

userSchema.pre("save", function(next){
    const user = this;

    if(!user.isModified("password")) return;

    const salt = randomBytes(16).toString('hex'); //This line generates a random salt for password hashing and then converts that 16 bits to hex form.
    const hashedPassword = createHmac("sha256", salt) //creates a hash code using sha256 algo and salt as secret key.
        .update(user.password)//updates the password
        .digest("hex");//.digest("hex") converts the hashed password into a hexadecimal string.

    this.salt = salt;
    this.password = hashedPassword;

    next(); //next is a callback function that tells Mongoose to proceed to the next middleware or complete the operation
});


// Static method to authenticate user and return JWT token
userSchema.static("authenticateUser", async function(email, password) {
    const user = await this.findOne({ email });
    console.log(user);
    if (!user) throw new Error("No user found!");

    // Hash the provided password
    const userProvidedHash = createHmac("sha256", user.salt)
        .update(password)
        .digest("hex");

    if (user.password !== userProvidedHash) throw new Error("Incorrect Password");

    // Generate JWT token
    const token = createToken(user);

    return token;
});

const User = model('user', userSchema);

export default User;