var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

module.exports = {
    sendPendingMail: function () {
    },
    sendValidationMail: function () {
        this.sendMail()
    },
    sendPasswordReset: function () {
    },

    sendActivitySummary: function (email, data) {

        var data = data || {title: "Bienvenue dans Yellow Start", user: {firstname: 'faou'}};
        data.layout = 'emailTemplate.ejs';
        sails.hooks.views.render("emails/activate-user", data, function (err, html) {
            if (err) {
                return console.log(err);
            }
            MailService.sendMail(email, "Rapport d'activité", html);
        });
    },

    sendStartupPublished: function (email, data) {
        data.title = "Nouvelle startup publiée : " + data.startup.startupName;
        data.layout = 'emailTemplate.ejs';
        sails.hooks.views.render("emails/startup-published", data, function (err, html) {
            if (err) return console.log(err);
            MailService.sendMail(email, "Rapport d'activité", html);
        });
    },

    sendAccountCreationEmail: function (email, data) {
        data.title = "Bienvenue dans Yellow Start";
        data.layout = 'emailTemplate.ejs';
        sails.hooks.views.render("emails/startup-published", data, function (err, html) {
            if (err) return console.log(err);
            MailService.sendMail(email, "Rapport d'activité", html);
        });
    },

    sendAccountCreationEmailAdmin: function (email, data) {
        data.title = "Nouvel utilisateur en attente dans Yellow Start";
        data.layout = 'emailTemplate.ejs';
        sails.hooks.views.render("emails/activate-user", data, function (err, html) {
            if (err) {
                return console.log(err);
            }
            MailService.sendMail(email, "Rapport d'activité", html);
        });
    },

    sendMail: function (email, subject, body, done) {

        var smtpTransport = nodemailer.createTransport(sails.config.mail.options);
        var mailOptions = {
            to: email,
            from: sails.config.mail.from,
            subject: subject,
            html: body
        };
        smtpTransport.sendMail(mailOptions, function (err) {
            if (err)console.log(err);
            else {
                console.log('Email envoyé')
            }
            //  req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
            done ? done(err, 'done') : '';
        });
    }
};