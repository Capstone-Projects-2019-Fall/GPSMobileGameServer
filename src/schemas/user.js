module.exports = function(mongoose) {

    const cardSchema = new mongoose.Schema({
        name: String,
        level: Number,
        energy: Number,
        pp: Number,
        inDeck: Boolean
    });

    const userSchema = new mongoose.Schema({
        name: String,
        password: String,
        library: [cardSchema],
        homebase: {
            type: {
                type: String, // Don't do `{ location: { type: String } }`
                enum: ['Point'], // 'location.type' must be 'Point'
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            }
        },
    });
    userSchema.index({name: -1});

    const User = mongoose.model('user', userSchema);

    return { userSchema, cardSchema, User}
};
