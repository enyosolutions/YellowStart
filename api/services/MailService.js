
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

module.exports = {
    sendPendingMail : function(){},
    sendValidationMail : function(){
        this.sendMail()
    },
    sendPasswordReset : function(){},

    sendActivitySummary : function (email , data){
        this.sendMail('inbox@batiga.com','Salut toi', 'my body my soul');
    },

    sendMail: function(email, subject, body , done){

        var smtpTransport = nodemailer.createTransport(sails.config.mail.options);
        var mailOptions = {
            to: email,
            from: sails.config.mail.from,
            subject: subject,
            html: body
        };
        smtpTransport.sendMail(mailOptions, function(err) {
            console.log(err);
          //  req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
            done ? done(err, 'done') : '';
        });
    }
};