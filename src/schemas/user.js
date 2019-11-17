module.exports = function(mongoose) {

    const userSchema = new mongoose.Schema({
        name: String,
        password: String,
        deck: [Number]
    });
    userSchema.index({name: -1});

    const User = mongoose.model('user', userSchema);

    return { userSchema, User}
};
