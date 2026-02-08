module.exports = (db) => {
    return async (req, res) => {
        await db.removeItem(req.params.id);
        res.sendStatus(200);
    };
};