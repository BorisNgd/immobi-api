const { jwt, SECRET_KEY } = require('../../auth');
const getKey = (req, res, next) => {

    let fbid = req.query.fbid;

    if (fbid != null) {
        let token = jwt.sign({ fbid: fbid }, SECRET_KEY, {});
        res.json({ success: true, token: token });
    } else {
        res.json({ success: false, message: "Missing fbid in query" });
    }
}


module.exports = {
    getKey: getKey,
  
};