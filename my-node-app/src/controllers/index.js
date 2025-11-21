class IndexController {
    getIndex(req, res) {
        res.send('Welcome to the Index Page');
    }

    postIndex(req, res) {
        const data = req.body;
        res.send(`Data received: ${JSON.stringify(data)}`);
    }
}

module.exports = IndexController;