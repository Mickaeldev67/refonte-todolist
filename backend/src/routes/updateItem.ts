module.exports = (db: any) => {
    return async (req: any, res: any) => {
        await db.updateItem(req.params.id, {
            name: req.body.name,
            completed: req.body.completed,
        });

        const item = await db.getItem(req.params.id);
        res.send(item);
    };
};