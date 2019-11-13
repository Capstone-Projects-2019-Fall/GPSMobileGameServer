module.exports = function(mongoose) {

    const enemySchema = new mongoose.Schema({
        name: String,
        nodename: String,
        hp: Number,
        regenrate: Number,
        attacks: [String]

    });
    enemySchema.index({name: -1});

    const Enemy = mongoose.model('enemy', enemySchema);

    return { enemySchema, Enemy}
};
