import { fetchGeoData } from '../services/ipLookupService.js';
import { db } from '../config/db.js';

export const IP_CACHE = {};
export const QUERY_CACHE = {};

export const logger = async (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');

    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.ip;

    if (!IP_CACHE[ip]) {
        const geoData = await fetchGeoData(ip);
        IP_CACHE[ip] = geoData;
        const { ip: geoIp, isp, city, country } = geoData;

        req.address = geoIp;
        req.isp = isp;
        req.city = city;
        req.country = country;

        const table = country !== 'Bangladesh' ? 'foreign_log' : 'log';
        const existingLog = db.checkExistingLog(geoIp);

        if (!existingLog) {
            setImmediate(() => {
                db.insertLog(table, geoIp, isp, city, country, req.path, req.headers['user-agent']);
            });
        }
    } else {
        const { ip: cachedIp, isp, city, country } = IP_CACHE[ip];
        req.address = cachedIp;
        req.isp = isp;
        req.city = city;
        req.country = country;
    }

    next();
};

export default logger;
