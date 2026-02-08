module.exports = (db) => {
    return async (req, res) => {
        const items = await db.getItems();
        res.send(items);
    };
};