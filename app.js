/**
 * Copyright (C) 2018-2019
 * All rights reserved, Designed By www.joolun.com
 * 注意：
 * 本软件为www.joolun.com开发研制，未经购买不得使用
 * 购买后可获得全部源代码（禁止转卖、分享、上传到码云、github等开源平台）
 * 一经发现盗用、分享等行为，将追究法律责任，后果自负
 */
/**
 * <version>2.3.0</version>
 */
import __config from './config/env'
import api from './utils/api'

App({
  api: api,
  globalData: {
    thirdSession: null
  },
  onLaunch: function () {
    //检测新版本
    this.updateManager()
  },
  updateManager(){
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })
  },
  //初始化，供每个页面调用 
  initPage: function () {
    let that = this
    return new Promise((resolve, reject) => {
      if (that.globalData.thirdSession == null) {//无thirdSession，进行登录
        that.doLogin()
          .then(res => {
            resolve("success")
          })
      } else {//有thirdSession，说明已登录，返回初始化成功
        resolve("success")
      }
    })
  },
  doLogin(){
    let that = this
    return new Promise((resolve, reject) => {
      wx.login({
        success: function (res) {
          if (res.code) {
            api.login({
              jsCode: res.code
            })
              .then(res => {
                let userInfo = res.data
                that.globalData.thirdSession = userInfo.sessionKey
                that.globalData.userInfo = userInfo
                resolve("success")
              })
          }
        }
      })
    })
  }
})