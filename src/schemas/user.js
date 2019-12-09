module.exports = function(mongoose) {

    const cardSchema = new mongoose.Schema({
        id: Number,
        level: Number,
        inDeck: Boolean
    });

    const userSchema = new mongoose.Schema({
        name: String,
        password: String,
        health: Number,
        gold: Number,
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
