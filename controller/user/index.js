const User = require('../../db').User
const sha1 = require('sha1')
const xss = require('xss')
const { createToken } = require('../../utils/token')
const { PWD_SECRET_STR } = require('../../utils/config')

const register = async function(ctx) {
  try {
    const { user_name = '', user_email = '', user_pwd = '' } = ctx.request.body
    const reg = /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
    if (user_email === '') {
      ctx.body = {
        code: 401,
        msg: '邮箱为空'
      }
      return
    } else if (!reg.test(user_email)) {
      ctx.body = {
        code: 401,
        msg: '邮箱格式不正确'
      }
      return
    }
    if (user_name === '') {
      ctx.body = {
        code: 401,
        msg: '名称为空'
      }
      return
    }
    if (user_pwd.length < 5) {
      ctx.body = {
        code: 401,
        msg: '密码位数小于5'
      }
      return
    }

    const res = await User.find({ user_email })
    if (res.length > 0) {
      ctx.body = {
        code: 409,
        msg: '该邮箱已被注册'
      }
      return
    }

    const user_pwd_sha = sha1(sha1(user_pwd + PWD_SECRET_STR))
    const user_name_xss = xss(user_name)
    const user = new User({
      user_name: user_name_xss,
      user_email,
      user_pwd: user_pwd_sha
    })

    // 存数据，并返回存取结果
    const saveRes = await user.save()
    if (saveRes._id !== null) {
      ctx.body = {
        code: 200,
        msg: '注册成功'
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '注册失败，服务器异常'
      }
    }
  } catch (err) {
    console.log(err)
    ctx.body = {
      code: 500,
      msg: '注册失败，服务器异常'
    }
  }
}

const login = async function(ctx) {
  try {
    const { user_email = '', user_pwd = '' } = ctx.request.body
    const reg = /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
    if (user_email === '') {
      ctx.body = {
        code: 401,
        msg: '邮箱为空'
      }
      return
    } else if (!reg.test(user_email)) {
      ctx.body = {
        code: 401,
        msg: '请输入正确的邮箱'
      }
      return
    }

    const user_pwd_sha = sha1(sha1(user_pwd + PWD_SECRET_STR))
    const res = await User.find({ user_email, user_pwd: user_pwd_sha })

    if (res.length <= 0) {
      ctx.body = {
        code: 401,
        msg: '登录失败，用户名或密码错误'
      }
    } else {
      const token = createToken(user_email)
      res[0].token = token
      res[0].save()
      ctx.body = {
        code: 200,
        msg: '登录成功',
        data: {
          token,
          user_email,
          user_name: res[0].user_name,
          user_avatar: res[0].user_avatar,
          user_gender: res[0].user_gender,
          user_age: res[0].user_age
        }
      }
    }
  } catch (err) {
    console.log(err)
    ctx.body = {
      code: 500,
      msg: '注册失败，服务器异常'
    }
  }
}

const resetPwd = async (ctx) => {
  try {
    const { user_email = '', user_pwd = '' } = ctx.request.body

    const reg = /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
    if (user_email === '') {
      ctx.body = {
        code: 401,
        msg: '邮箱为空'
      }
      return
    } else if (!reg.test(user_email)) {
      ctx.body = {
        code: 401,
        msg: '请输入正确的邮箱'
      }
      return
    }

    if (user_pwd.length < 5) {
      ctx.body = {
        code: 401,
        msg: '密码位数小于5'
      }
      return
    }

    const res = await User.find({ user_email })
    if (res.length <= 0) {
      ctx.body = {
        code: 409,
        msg: '该邮箱未注册'
      }
      return
    } else {
      const user_pwd_sha = sha1(sha1(user_pwd + PWD_SECRET_STR))
      res[0].user_pwd = user_pwd_sha
      res[0].save()
      ctx.body = {
        code: 200,
        msg: '修改密码成功'
      }
    }
  } catch (err) {
    console.log(err)
    ctx.body = {
      code: 500,
      msg: '修改密码失败'
    }
  }
}

module.exports = {
  register,
  login,
  resetPwd
}
