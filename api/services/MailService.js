
var nodemailer = require('nodemailer');

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

        var smtpTransport = nodemailer.createTransport(sails.config.mail.protocol, {
            service: sails.config.mail.options.service,
            auth: {
                user: sails.config.mail.options.user,
                pass: sails.config.mail.options.pass
            }
        });
        var mailOptions = {
            to: email,
            from: sails.config.mail.from,
            subject: subject,
            text: body
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          //  req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
            done ? done(err, 'done') : '';
        });
    }
};