const { mongooseToObject } = require('../../utils/mongo')
const Course = require('../models/Course')

class CoursesController {

    // [GET] /courses/:slug
    show(req, res, next) {
        Course.findOne({ slug: req.params.slug })
            .then(response =>
                res.render('courses/show', { course: mongooseToObject(response) })
            )
            .catch(next);
    }

    // [POST] /courses/store
    store(req, res, next) {
        const fromData = { ...req.body };
        fromData.image = `https://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`;
        const course = new Course(fromData);
        course.save()
            .then(() => res.redirect(`/me/stored/courses`))
            .catch(next)
    }

    // [GET] /courses/create
    create(req, res, next) {
        res.render('courses/create')
    }

    // [GET] /courses/:id/edit
    edit(req, res, next) {
        Course.findById(req.params.id)
            .then(course => res.render('courses/edit',
                { course: mongooseToObject(course) }
            ))
            .catch(next)

    }

    // [PUT] /courses/:id
    update(req, res, next) {
        Course.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/me/stored/courses'))
            .catch(next)
    }

    // [DELETE] /courses/:id
    destroy(req, res, next) {
        Course.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next)
    }

    // [DELETE] /courses/:id/force
    forceDestroy(req, res, next) {
        Course.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next)
    }

    // [PATCH] /courses/:id/restore
    restore(req, res, next) {
        Course.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next)
    }

    // [POST] /courses/handle-form-actions
    handleFormActions(req, res, next) {
        switch (req.body.action) {
            case 'delete':
                Course.delete({ _id: { $in: req.body.courseIds } })
                    .then(() => res.redirect('back'))
                    .catch(next)
                break;

            case 'force-delete':
                Course.deleteOne({ _id: { $in: req.body.courseIds } })
                    .then(() => res.redirect('back'))
                    .catch(next)
                break;

            case 'restore':
                Course.restore({ _id: { $in: req.body.courseIds } })
                    .catch(next)
                break;

            default:
                res.json({ message: 'Action is invalid!' });
        }
    }
}

module.exports = new CoursesController;