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
    page: {
      searchCount: false,
      current: 1,
      size: 10
    },
    loadmore: true,
    goodsList: [],
    goodsListNew: [],
    goodsListHot: [],
    swiperData: [],
    noticeData: []
  },
  onLoad() {
    app.initPage()
      .then(res => {
        this.loadData()
      })
  },
  loadData(){
    this.swiperGet()
    this.noticeGet()
    this.goodsNew()
    this.goodsHot()
    this.goodsPage()
  },
  onShareAppMessage: function () {
    let title = '保供抗疫•消费扶贫'
    let path = 'pages/home/index'
    return {
      title: title,
      path: path,
      success: function (res) {
        if (res.errMsg == 'shareAppMessage:ok') {
          console.log(res.errMsg)
        }
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //获取轮播图
  swiperGet() {
    app.api.noticeGet({
      type: '1',
      enable: '1'
    })
      .then(res => {
        let notice = res.data
        if (notice){
          this.setData({
            swiperData: notice.listNoticeItem
          })
        }
      })
  },
  //获取广告通知
  noticeGet() {
    app.api.noticeGet({
      type: '2',
      enable: '1'
    })
      .then(res => {
        let notice = res.data
        if (notice) {
          this.setData({
            noticeData: notice.listNoticeItem
          })
        }
      })
  },
  //新品首发
  goodsNew() {
    app.api.goodsPage({
      searchCount: false,
      current: 1,
      size: 5,
      descs: 'create_time'
    })
      .then(res => {
        let goodsListNew = res.data.records
        this.setData({
          goodsListNew: goodsListNew
        })
      })
  },
  //热销单品
  goodsHot() {
    app.api.goodsPage({
      searchCount: false,
      current: 1,
      size: 5,
      descs: 'sale_num'
    })
      .then(res => {
        let goodsListHot = res.data.records
        this.setData({
          goodsListHot: goodsListHot
        })
      })
  },
  goodsPage(e) {
    app.api.goodsPage(this.data.page)
      .then(res => {
        let goodsList = res.data.records
        this.setData({
          goodsList: [...this.data.goodsList, ...goodsList]
        })
        if (goodsList.length < this.data.page.size) {
          this.setData({
            loadmore: false
          })
        }
      })
  },
  refresh(){
    this.setData({
      loadmore: true,
      ['page.current']: 1,
      goodsList: [],
      goodsListNew: [],
      goodsListHot: []
    })
    this.loadData()
  },
  onPullDownRefresh(){
    // 显示顶部刷新图标
    wx.showNavigationBarLoading()
    this.refresh()
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading()
    // 停止下拉动作
    wx.stopPullDownRefresh()
  },
  onReachBottom() {
    if (this.data.loadmore) {
      this.setData({
        ['page.current']: this.data.page.current + 1
      })
      this.goodsPage()
    }
  },
  jumpPage(e){
    let page = e.currentTarget.dataset.page
    if (page){
      wx.navigateTo({
        url: page
      })
    }
  }
})
