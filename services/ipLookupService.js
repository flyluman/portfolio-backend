import fetch from 'node-fetch';

export async function fetchGeoData(ip) {
    try {
        const response = await fetch(`http://ipwhois.app/json/${ip}?objects=ip,isp,city,country`);
        if (response.ok) {
            return await response.json();
        } else {
            return { ip, isp: 'Unknown', city: 'Unknown', country: 'Unknown' };
        }
    } catch (err) {
        return { ip, isp: 'Unknown', city: 'Unknown', country: 'Unknown' };
    }
}
