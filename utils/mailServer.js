const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: 'smtp.qq.com',
  port: 587,
  secureConnection: false,
  auth: {
    user: '844782417@qq.com',
    pass: 'ygjyvthnvjwubdef'
  }
})

module.exports.sendEmail = (mailOptions) => {
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log('发送失败', err)
    }
    console.log(`发送邮件给${mailOptions.to}成功`)
  })
}
