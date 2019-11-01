module.exports = function(mongoose) {

    const userSchema = new mongoose.Schema({
        name: String,
        password: String,
        deck: [{
            name: String,
            level: Number,
            energy: Number,
            pp: Number
        }]
    });
    userSchema.index({name: -1});

    const User = mongoose.model('user', userSchema);

    return { userSchema, User}
};
