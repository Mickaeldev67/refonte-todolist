module.exports = (db) => {
    return async (req, res) => {
        await db.updateItem(req.params.id, {
            name: req.body.name,
            completed: req.body.completed,
        });

        const item = await db.getItem(req.params.id);
        res.send(item);
    };
};