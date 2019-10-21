module.exports = function(mongoose) {

    const nodeSchema = new mongoose.Schema({
        name: String,
        geoData: {
            "type" : "Point",
            "coordinates" : [
                -122.5,
                37.7
            ]
        }
    });

    return Node = mongoose.model('Node', nodeSchema);
};
