const Listing = require('../models/listing');

// Search Listings
module.exports.searchListings = async (req, res) => {
    const query = req.query.query;
    try {
        const listings = await Listing.find({ title: new RegExp(query, 'i') });
        res.render('searchResults.ejs', { listings });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
