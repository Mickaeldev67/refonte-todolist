const { v4: uuid } = require('uuid');

module.exports = (db) => {
    return async (req, res) => {
        const item = {
            id: uuid(),
            name: req.body.name,
            completed: false,
        };

        db.storeItem(item);
        res.send(item);
    };
};