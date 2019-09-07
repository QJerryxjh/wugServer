const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: 'smtp.163.com',
  port: 465,
  secureConnection: false,
  auth: {
    user: 'qjerryxjh@163.com',
    pass: 'xjh1997'
  }
})

module.exports.sendEmail = (mailOptions) => {
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log('发送失败', err)
      return
    }
    console.log(`发送邮件给${mailOptions.to}成功`)
  })
}
