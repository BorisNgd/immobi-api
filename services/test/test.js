const helloWorld = (req , res , next) => {
    res.send('Hello World');
}

const helloWorldSecure = (req, res, next) => {
    res.send('Hello World with headers ' + req.headers.authorization);
}


module.exports = {
    helloWorld: helloWorld,
    helloWorldSecure: helloWorldSecure
};