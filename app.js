var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/home', indexRouter);
app.use('/users', usersRouter);

app.post('/contctus', (req,res)=>{  
  console.log(req.body);
  if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
    return res.send({"responseCode" : 1,"responseDesc" : "Please select captcha"});
  }

  // Put your secret key here.
  var secretKey = "6LeyAyAaAAAAAOLGSp7rhGiLelo2ZuXVB_UW5pm-";
  // req.connection.remoteAddress will provide IP address of connected user.
  var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
  

  request(verificationUrl,function(error,response,body) {
    body = JSON.parse(body);
    // console.log(body);
    // Success will be true or false depending upon captcha validation.
    if(body.success !== undefined && !body.success) {
      return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
    }
  //  return res.json({"responseCode" : 0,"responseDesc" : "Sucess"});
  });


  var name=req.body.name;
  var email = req.body.email;
  var message= req.body.message;

  var html = "<div style='text-align:center;width:100%;margin:20px 0px;float:left;'><img src='https://emeraldparkmemorial.com.au/images/logo.png' style='width:250px;' /></div><br /> ";

 html+= "Name: "+name+"<br>\n<br>\n";
 html+= "Email: "+email+"<br>\n<br>\n";
 html+= "Message: "+message+"<br>\n<br>\n";

 

   // Generate test SMTP service account from ethereal.email
   // Only needed if you don't have a real mail account for testing
   let testAccount =  nodemailer.createTestAccount();
 
   // create reusable transporter object using the default SMTP transport
   var transporter = nodemailer.createTransport({
     service: 'gmail',
    secure: false, // true for 465, false for other ports
     debug:true,
     logger:true,
     auth: {
         user: 'info@emeraldparkmemorial.com.au',
         pass: 'Bigfatdog1a!'
     }
     });
 
  //  send mail with defined transport object
   let info =  transporter.sendMail({
     from: email, // sender address
     to: "info@emeraldparkmemorial.com.au", // list of receivers
     subject: "Contact Us", // Subject line
     text: "Contact Us", // plain text body
     html: html // html body
   });
 
 
  return res.json({"responseCode" : 0,"responseDesc" : "Sucess"});

  //  return   res.redirect("/");
    
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
