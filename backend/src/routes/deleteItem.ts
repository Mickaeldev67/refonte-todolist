module.exports = (db: any) => {
    return async (req: any, res: any) => {
        await db.removeItem(req.params.id);
        res.sendStatus(200);
    };
};