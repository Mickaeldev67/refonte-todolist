module.exports = (db: any) => {
    return async (req: any, res: any) => {
        const items = await db.getItems();
        res.send(items);
    };
};