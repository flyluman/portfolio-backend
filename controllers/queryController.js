import { db } from '../config/db.js';
import { QUERY_PASS } from '../config/config.js';

export const queryHandler = (req, res) => {
    const { name, pass } = req.body;

    if (!name || !pass || pass !== QUERY_PASS || !name.match(/foreign_log|log|msg/g)) {
        return res.status(401).json({ error: 'Unauthorized request' });
    }

    try {
        res.json(db.fetchAll(name).slice(50));
    } catch (err) {
        console.error('Query Error:', err);
        res.status(500).json({ error: 'Query failed' });
    }
};
