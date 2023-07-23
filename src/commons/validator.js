export default {
  // 必填
  required: (msg, trigger) => {
    return {
      required: true,
      message: msg,
      trigger: trigger || ['blur', 'change']
    }
  },
  // 长度
  length: (min, max) => {
    if (min !== max) {
      return { min, max, message: `长度在 ${min} 到 ${max} 个字符`, trigger: 'blur' }
    } else {
      return { min, max, message: `长度不超过 ${max} 个字符`, trigger: 'blur' }
    }
  },
  // 浮点
  float: (length, num = 2) => ({
    validator: (rule, value, callback) => {
      const reg = new RegExp(`^\\d{1,${length}}(\\.\\d{1,${num}})?$`)
      reg.test(value) ? callback() : callback(new Error(`只能输入${length}整数和${num}位小数！`))
    },
    trigger: 'change'
  }),
  isFloat: (length = 5, num = 2) => ({
    validator: (rule, value, callback) => {
      const reg = new RegExp(`^\\d{0,${length}}(\\.\\d{1,${num}})?$`)
      reg.test(value) ? callback() : callback(new Error(`只能输入${length}位整数和${num}位小数！`))
    },
    trigger: ['blur', 'change']
  }),
  isNumber: (max = 12) => ({
    validator: (rule, value, callback) => {
      value = value || ''
      const reg = new RegExp(`^\\d{0,${max}}$`)
      reg.test(value) ? callback() : callback(new Error(`请输入${max}位内的整数值！`))
    },
    trigger: ['blur', 'change']
  }),
  isPhoneNumber: () => {
    return {
      validator: (rule, value, callback) => {
        const reg = /^1[3456789]\d{9}$/
        if (value) {
          reg.test(value)  ? callback() : callback(new Error('请输入正确格式的电话号码！'))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change']
    }
  },
  //判断电话为手机电话或者固定电话
  isPhoneOrFamilyNumber: () => {
    return {
      validator: (rule, value, callback) => {
        const reg = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/
        const reg1 = /^1[3456789]\d{9}$/
        if (value) {
          reg.test(value) || reg1.test(value)  ? callback() : callback(new Error('请输入正确格式的电话号码，固话格式为0000-00000000！'))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change']
    }
  },
  //判断电话为固定电话
  isFixedPhoneNumber: () => {
    return {
      validator: (rule, value, callback) => {
        const reg = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/
        if (value) {
          reg.test(value) ? callback() : callback(new Error('请输入正确格式的固话或者手机号！固话格式为0000-00000000'))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change']
    }
  },
  // 整数验证
  number: (rule, value, callback) => {
    const reg = /^\d+$/
    reg.test(value) ? callback() : callback(new Error('只能输入整数！'))
  },
  // 整数长度验证
  fixedNumber: (min, max) => (rule, value, callback) => {
    const reg = new RegExp(`^[0-9]\{${min},${max}\}$`)
    reg.test(value) ? callback() : callback(new Error(`请输入${min}-${max}位内的整数值！`))
  },
  // 判断邮箱
  isFixedMail: () => {
    return{
      validator: (rule, value, callback) => {
        const reg = new RegExp(`^[0-9]\{1,6}$`)
        if (value) {
          reg.test(value) ? callback() : callback(new Error(`请输入1-6位内的整数值！`))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change']
    }
  },
  special: (rule, value, callback) => {
    return {
      validator: (rule, value, callback) => {
        const reg = /^[0-9a-zA-Z]*$/g
        if (value) {
          reg.test(value) ? callback() : callback(new Error('只能输入英文字母和数字！'))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change']
    }
  },
  // 浮点长度验证
  fixedFloat: (max) => (rule, value, callback) => {
    const reg = new RegExp(`^\\d\{1,${max}\}$`)
    reg.test(value) ? callback() : callback(new Error(`请输入不超过${max}位内的数值！`))
  },
  // 字符长度验证
  fixedStr: (min, max) => (rule, value, callback) => {
    const reg = new RegExp(`^\\d\{${min},${max}\}$`)
    reg.test(value) ? callback() : callback(new Error(`请输入${min}-${max}位内的整数值！`))
  },
}