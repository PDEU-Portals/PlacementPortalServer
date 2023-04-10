
const nodemailer = require('nodemailer');
const {google} = require('googleapis');
const { oauth2 } = require('googleapis/build/src/apis/oauth2');
const { OAuth2Client } = require('google-auth-library');
require("dotenv").config()
const code = require('../helpers/link_generator.py');


const CLIENT_ID=process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET=process.env.GMAIL_CLIENT_SECRET;
const CLIENT_URI=process.env.GMAIL_CLIENT_URI;
const REFRESH_TOKEN=process.env.GMAIL_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, CLIENT_URI);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendmail = async (email)=>{
  
    try{
        const accessToken = await oauth2Client.getAccessToken();
        console.log(accessToken);
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth : {
                type: 'OAuth2',
                user: process.env.GMAIL_ID,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }

        });
        const mailOptions = {
            from: 'no reply pdeu placement portal',
            to: email,
            subject: "Hello From Gmail Using API Phoood Diya Mattkkka",
            text: "Please verify with the following link",
            html: "Verify your account from placement portal <br> <a></a>"

        };
        console.log(mailOptions);

        const result =
            await transport.sendMail(mailOptions);
            return (result);


    }
    catch (err){
        return ({err: err.message});
    }
}



exports.redirect_User = async(req, res)=>{
   const { user_id, password, email } = req.body

   sendmail(email)
    .then(result=>console.log("Email Delivered ....", result))
    .catch(err=> console.log({err: err.message}))

    res.status(302).send("You are Currently Being Redirected to Veifuaction Link");
    res.redirect(`http://localhost:3000/api/v1/users/${user_id}/verify-email/generate_link`);
}