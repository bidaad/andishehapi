var nodemailer = require('nodemailer');
const axios = require('axios');


sendSMS = (toCellphone, smsMessage) => {
    if(toCellphone.startsWith("+98"))
        sendIranSMS(toCellphone, smsMessage)
    else
        sendInternationalSMS(toCellphone, smsMessage)

}



sendIranSMS = (toCellphone, smsMessage) => {
    axios.post('https://RestfulSms.com/api/Token', {
        UserApiKey: "386174ca7bc805f3485d82ef",
        SecretKey: "987CD5722F7146368BFC"
    })
        .then((response) => {
            const Token = response.data.TokenKey;
            sendMEssage(Token, toCellphone, smsMessage)
        })
        .catch(function (error) {
            alert(error)
        });
}


sendMEssage = (token, toCellphone, smsMessage) => {
    axios.post('https://RestfulSms.com/api/MessageSend', {
        "Messages": [smsMessage],
        "MobileNumbers": [toCellphone],
        "LineNumber": "30004505004748",
        "SendDateTime": "",
        "CanContinueInCaseOfError": "false",
    },
        {
            headers: {
                'x-sms-ir-secure-token': token,
            }
        }
    )
        .then((response) => {
            const sqlQuery = `insert into SMSLog (ToNumber,SMSText,SendDate,HCSMSOperatorCode, resultToken) values
            ('${toCellphone}',N'${smsMessage}',getdate(),1, '${response.data.BatchKey}' )
            `;
            runQuery(sqlQuery);

        })
        .catch(function (error) {
            alert(error)
        });
}

sendEmail = (to, subject, mailBody) => {
    try {
        var transporter = nodemailer.createTransport({
            host: '188.40.247.130',
            port: 25,
            secure: false,
            auth: {
                user: 'info@allfrenchnews.com',
                pass: 'rdlpby4itcvqjkxhangu'
            }
        });
        var mailOptions = {
            from: 'info@allfrenchnews.com',
            to: to,
            subject: subject,
            text: mailBody
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return false;
            } else {
                return true;
            }
        });
    }
    catch{

    }
}

makeID = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

genNum = (length) => {
    var result = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


//export default sendEmail;