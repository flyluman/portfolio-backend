import { parentPort, workerData } from 'worker_threads';
import fetch from 'node-fetch';

async function fetchGeoData(ip) {
    try {
        const response = await fetch(`http://ipwhois.app/json/${ip}?objects=ip,isp,city,country`);
        if (response.ok) {
            const data = await response.json();
            parentPort.postMessage(data);
        } else {
            parentPort.postMessage({
                ip, isp: 'Unknown', city: 'Unknown', country: 'Unknown'
            });
        }
    } catch (err) {
        parentPort.postMessage({
            ip, isp: 'Unknown', city: 'Unknown', country: 'Unknown'
        });
    }
}

fetchGeoData(workerData.ip);
