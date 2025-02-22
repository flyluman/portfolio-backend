export const whoAmIHandler = (req, res) => {
    res.json({
        ip: req.address,
        isp: req.isp,
        city: req.city,
        country: req.country
    });
};
