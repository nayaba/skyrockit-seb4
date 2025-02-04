const home = (req, res) => {
    console.log('user in session: ', req.session.user)
    res.render('index.ejs', {title: 'Skyrockit'})
}

module.exports = {
    home,
}