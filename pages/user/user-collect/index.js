/**
 * Copyright (C) 2018-2019
 * All rights reserved, Designed By www.joolun.com
 * 注意：
 * 本软件为www.joolun.com开发研制，未经购买不得使用
 * 购买后可获得全部源代码（禁止转卖、分享、上传到码云、github等开源平台）
 * 一经发现盗用、分享等行为，将追究法律责任，后果自负
 */
const util = require('../../../utils/util.js')
const app = getApp()

Page({
  data: {
    page: {
      searchCount: false,
      current: 1,
      size: 15,
      ascs: '',//升序字段
      descs: 'create_time'
    },
    parameter: {
      type: '1'
    },
    loadmore: true,
    userCollect: []
  },
  onLoad(options) {
    app.initPage()
      .then(res => {
        this.userCollectPage()
      })
  },
  onShow(options) {
    
  },
  userCollectPage() {
    app.api.userCollectPage(Object.assign(
      {},
      this.data.page,
      util.filterForm(this.data.parameter)
    ))
      .then(res => {
        let userCollect = res.data.records
        this.setData({
          userCollect: [...this.data.userCollect, ...userCollect]
        })
        if (userCollect.length < this.data.page.size) {
          this.setData({
            loadmore: false
          })
        }
      })
  },
  onReachBottom() {
    if (this.data.loadmore) {
      this.setData({
        ['page.current']: this.data.page.current + 1
      })
      this.userCollectPage()
    }
  },
  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  }, 
  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
  userCollectDel(e){
    let that = this
    let index = e.target.dataset.index
    let userCollect = this.data.userCollect
    wx.showModal({
      content: '确定删除收藏吗？',
      cancelText: '我再想想',
      confirmColor: '#ff0000',
      success(res) {
        if (res.confirm) {
          app.api.userCollectDel(userCollect[index].id)
            .then(res => {
              userCollect.splice(index, 1)
              that.setData({
                userCollect: userCollect
              })
            })
        }
      }
    })
  }
})
