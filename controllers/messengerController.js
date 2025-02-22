import { db } from '../config/db.js';
import { CLIENT_URL } from '../config/config.js';

export const messengerHandler = (req, res) => {
    const { name, email, msg } = req.body;

    if (!name || !msg) {
        return res.status(400).json({ error: 'Name and message are required.' });
    }

    try {
        setImmediate(() => {
            db.insertMsg(req.address, req.isp, req.city, req.country, req.headers['user-agent'], name, email || null, msg);
        });
        res.redirect(CLIENT_URL);
    } catch (err) {
        console.error('Messenger Error:', err);
        res.status(500).json({ error: 'Failed to save message' });
    }
};
