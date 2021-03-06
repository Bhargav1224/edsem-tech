const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
	first_name: { type: String, required: true },
	last_name: { type: String, required: false },
	email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirm_password:{type:String,require:false}
}, {
    timestamps: true,
    versionKey:false
});


//hashing password 
userSchema.pre("save", function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    bcrypt.hash(this.password, 8, (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
    })
})

//checking if both the passwords are matching are not 
userSchema.methods.checkPassword = function (password) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, this.password, (er, same) => {
            if (er) return reject(er);
            resolve(same);
        })
    })
}

module.exports = mongoose.model("user", userSchema);