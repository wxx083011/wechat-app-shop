/**
 * Copyright (C) 2018-2019
 * All rights reserved, Designed By www.joolun.com
 * 注意：
 * 本软件为www.joolun.com开发研制，未经购买不得使用
 * 购买后可获得全部源代码（禁止转卖、分享、上传到码云、github等开源平台）
 * 一经发现盗用、分享等行为，将追究法律责任，后果自负
 */
const app = getApp()

Page({
  data: {
    orderLogistics: [],
    id: null
  },
  onShow() {
    
  },
  onLoad(options) {
    this.setData({
      id: options.id
    })
    app.initPage()
      .then(res => {
        this.orderLogisticsGet(this.data.id)
      })
  },
  orderLogisticsGet(id){
    let that = this
    app.api.orderLogisticsGet(id)
      .then(res => {
        let orderLogistics = res.data
        this.setData({
          orderLogistics: orderLogistics
        })
      })
  },
  //复制内容
  copyData(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.data
    })
  },
})