module.exports = function(mongoose) {

    const nodeSchema = new mongoose.Schema({
        name: String,
        location: {
            type: {
                type: String, // Don't do `{ location: { type: String } }`
                enum: ['Point'], // 'location.type' must be 'Point'
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            }
        }
    });
    nodeSchema.index({location: '2dsphere'});

    const Node = mongoose.model('Node', nodeSchema);

    return { nodeSchema, Node}
};
