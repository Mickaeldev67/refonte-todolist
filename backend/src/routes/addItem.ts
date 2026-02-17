export {};

const { v4: uuid } = require('uuid');

module.exports = (db: any) => {
    return async (req: any, res: any) => {
        const item = {
            id: uuid(),
            name: req.body.name,
            completed: false,
        };

        db.storeItem(item);
        res.send(item);
    };
};