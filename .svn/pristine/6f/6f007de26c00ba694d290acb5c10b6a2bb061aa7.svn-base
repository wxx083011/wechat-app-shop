/**
 * Copyright (C) 2018-2019
 * All rights reserved, Designed By www.joolun.com
 * 注意：
 * 本软件为www.joolun.com开发研制，未经购买不得使用
 * 购买后可获得全部源代码（禁止转卖、分享、上传到码云、github等开源平台）
 * 一经发现盗用、分享等行为，将追究法律责任，后果自负
 */
const app = getApp()
Component({
  properties: {
    switchOn: {
      type: Boolean,
      value: true
    },
  },
  data: {
    userInfo: null
  },
  attached() {
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  methods: {
    agreeGetUser(e) {
      if (e.detail.errMsg == 'getUserInfo:ok') {
        app.api.userInfoSave(e.detail)
          .then(res => {
            let userInfo = res.data
            this.setData({
              userInfo: userInfo
            })
            app.globalData.userInfo = userInfo
          })
      }
    },
  }
})