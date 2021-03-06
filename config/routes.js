/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

    /****************************************************************************
     *                                                                          *
     * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
     * etc. depending on your default view engine) your home page.              *
     *                                                                          *
     * (Alternatively, remove this and add an `index.html` file in your         *
     * `assets` directory)                                                      *
     *                                                                          *
     ****************************************************************************/

    '/': 'StartupController.home',
    'POST /auth/register': 'UserController.create',
    'POST /auth/login': 'AuthController.login',
    'POST /auth/forgot': 'AuthController.forgot',
    '/auth/user': 'AuthController.get',
    'PUT /auth/update/:id': 'UserController.update',
    'GET /user/token/:resetToken': 'UserController.getByToken',
    'POST /user/reset/:resetToken': 'UserController.reset',


    'GET /api/crud/startup': 'StartupController.list',
    '/startup/new': {view: 'startup/new'},
    'GET /api/luna/actions': 'StartupController.lunaActions',
    '/startup/upload-logo': 'StartupController.uploadLogo',
    '/startup/upload-picture': 'StartupController.uploadPicture',
    '/startup/upload-images': 'StartupController.uploadImages',
    '/startup/upload-file': 'StartupController.uploadFile',
    '/startup/delete-file': 'StartupController.deleteFile',
    'GET /startup/:id/bookmark':  'User/BookmarkController.list',
    'POST /startup/:id/bookmark':  'User/BookmarkController.post',
    'DELETE /startup/:id/bookmark':  'User/BookmarkController.delete',
    '/startup/:id': {view: 'startup/view'},

    // 'GET /api/crawler/meta': 'Api/CrawlerController.meta',
    'GET /api/crud/startup-comment': 'StartupController.listComments',

    'GET /api/crawler/autocomplete': 'Api/CrawlerController.autocomplete',


    'GET /api/crud/:endpoint': 'Api/CrudController.list',
    'GET /api/crud/:endpoint/:id': 'Api/CrudController.get',
    'POST /api/crud/:endpoint': 'Api/CrudController.post',
    'PUT /api/crud/:endpoint/:id': 'Api/CrudController.put',
    'PATCH /api/crud/:endpoint/:id': 'Api/CrudController.patch',
    'DELETE /api/crud/:endpoint/:id': 'Api/CrudController.delete',


    '/user/upload-picture': 'UserController.uploadFile',
    '/user/delete-picture': 'UserController.removeFile',
    '/gitrefresh/azoeieovoaizdqodaoizoiqosidqsndqndqdo': 'StartupController.gitrefresh'
    /***************************************************************************
     *                                                                          *
     * Custom routes here...                                                    *
     *                                                                          *
     * If a request to a URL doesn't match any of the custom routes above, it   *
     * is matched against Sails route blueprints. See `config/blueprints.js`    *
     * for configuration options and examples.                                  *
     *                                                                          *
     ***************************************************************************/

};
