const User = require('../models/user')

const newApplication = (req, res) => {
    res.render('applications/new.ejs', { title: 'Add a New Application' })
}

const createApplication = async (req, res) => {
    // user id = req.params.userId
    // user id = req.session.user._id
    try {  
        const currentUser = await User.findById(req.params.userId)
        currentUser.applications.push(req.body) // pushing the formData into the user model
        await currentUser.save() // save our edits
        res.redirect(`/users/${currentUser._id}/applications`)
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
}

const index = async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId)
        res.render('applications/index.ejs', {
            title: 'Your Applications',
            applications: currentUser.applications,
        })
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
}

const show = async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId)
        const application = currentUser.applications.id(req.params.applicationId)
        res.render('applications/show.ejs', {
            title: application.title,
            application,
        })
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
}

const deleteApplication = async (req, res) => {
    try {
        console.log('inside delete')
        const currentUser = await User.findById(req.params.userId)
        currentUser.applications.id(req.params.applicationId).deleteOne()
        await currentUser.save()
        res.redirect(`/users/${currentUser._id}/applications`)
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
}

const edit = async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId)
        const application = currentUser.applications.id(req.params.applicationId)
        res.render('applications/edit.ejs', {
            title: application.title,
            application,
        })
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
}

module.exports = {
    newApplication,
    createApplication,
    index,
    show,
    deleteApplication,
    edit,
}