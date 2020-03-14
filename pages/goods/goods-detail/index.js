/**
 * Copyright (C) 2018-2019
 * All rights reserved, Designed By www.joolun.com
 * 注意：
 * 本软件为www.joolun.com开发研制，未经购买不得使用
 * 购买后可获得全部源代码（禁止转卖、分享、上传到码云、github等开源平台）
 * 一经发现盗用、分享等行为，将追究法律责任，后果自负
 */
const WxParse = require('../../../public/wxParse/wxParse.js');
import Poster from '../../../components/wxa-plugin-canvas/poster/poster';
const { base64src } = require('../../../utils/base64src.js')
const app = getApp()

Page({
  data: {
    goodsDetail: [],
    goodsSpecData: [],
    goodsAppraises: [],
    currents: 1,
    modalSku: false,
    modalSkuType: '',
    shoppingCartCount: 0,
    shareShow: '',
    serviceList: [
      {
        name: '24小时内发货',
        desc: ''
      }, {
        name: '7天无理由退款',
        desc: '满足7天无理由退换货申请的前提下，包邮商品需要买家承担退货邮费，非包邮商品需要买家承担发货和退货邮费。'
      },
      {
        name: '全国包邮',
        desc: ''
      }
    ],
    modalService: ''
  },
  onLoad(options) {
    let id
    if (options.scene){
      id = decodeURIComponent(options.scene)
    }else{
      id = options.id
    }
    this.setData({
      id: id
    })
    app.initPage()
      .then(res => {
        this.goodsGet(id)
        this.goodsSpecGet(id)
        this.shoppingCartCount()
        this.goodsAppraisesPage()
      })
  },
  onShareAppMessage: function () {
    let goodsDetail = this.data.goodsDetail
    let title = goodsDetail.name
    let imageUrl = goodsDetail.picUrls[0]
    let path = 'pages/goods/goods-detail/index?id=' + goodsDetail.id
    return {
      title: title,
      path: path,
      imageUrl: imageUrl,
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
  goodsGet(id) {
    app.api.goodsGet(id)
      .then(res => {
        let goodsDetail = res.data
        this.setData({
          goodsDetail: goodsDetail
        })
        //html转wxml
        WxParse.wxParse('description', 'html', goodsDetail.description, this, 0)
      })
  },
  goodsSpecGet(spuId){
    app.api.goodsSpecGet({
      spuId: spuId
    })
      .then(res => {
        let goodsSpecData = res.data
        this.setData({
          goodsSpecData: goodsSpecData
        })
      })
  },
  goodsAppraisesPage() {
    app.api.goodsAppraisesPage({
      current: 1,
      size: 3,
      descs: 'create_time',
      spuId: this.data.id
    })
      .then(res => {
        let goodsAppraises = res.data
        this.setData({
          goodsAppraises: goodsAppraises
        })
      })
  },
  change: function (e) {
    this.setData({
      currents: e.detail.current + 1
    })
  },
  showModalService(){
    this.setData({
      modalService: 'show'
    })
  },
  hideModalService() {
    this.setData({
      modalService: ''
    })
  },
  showModalSku(e) {
    this.setData({
      modalSku: true,
      modalSkuType: e.target.dataset.type ? e.target.dataset.type : ''
    })
  },
  shoppingCartCount(){
    app.api.shoppingCartCount()
      .then(res => {
        let shoppingCartCount = res.data
        this.setData({
          shoppingCartCount: shoppingCartCount
        })
      })
  },
  operateCartEvent(){
    this.shoppingCartCount()
  },
  changeSpec(e) {
    this.setData({
      goodsSpecData: e.detail.goodsSpecData
    })
  },
  //收藏
  userCollect(){
    let goodsDetail = this.data.goodsDetail
    let collectId = goodsDetail.collectId
    if (collectId){
      app.api.userCollectDel(collectId)
        .then(res => {
          wx.showToast({
            title: '已取消收藏',
            icon: 'success',
            duration: 2000
          })
          goodsDetail.collectId = null
          this.setData({
            goodsDetail: goodsDetail
          })
        })
    }else{
      app.api.userCollectAdd({
        type: '1',
        relationIds: [goodsDetail.id]
      })
        .then(res => {
          wx.showToast({
            title: '收藏成功',
            icon: 'success',
            duration: 2000
          })
          goodsDetail.collectId = res.data[0].id
          this.setData({
            goodsDetail: goodsDetail
          })
        })
    }
  },

  shareShow(){
    this.setData({
      shareShow: 'show'
    })
  },
  shareHide(){
    this.setData({
      shareShow: ''
    })
  },
  onPosterSuccess(e) {
    const { detail } = e
    this.setData({
      posterUrl: detail
    })
  },
  onPosterFail(err) {
    console.error(err);
  },
  hidePosterShow(){
    this.setData({
      posterShow: false,
      shareShow: ''
    })
  },
  /**
   * 异步生成海报
   */
  onCreatePoster() {
    app.api.qrCodeUnlimited({
      page: 'pages/goods/goods-detail/index',
      scene: this.data.goodsDetail.id
    })
      .then(res => {
        let base64 = res.data
        base64src(base64 , res => {
          let qrCode = res
          //海报配置请参考 https://github.com/jasondu/wxa-plugin-canvas
          let posterConfig = {
            width: 750,
            height: 1280,
            backgroundColor: '#fff',
            debug: false,
            blocks: [
              {
                width: 690,
                height: 808,
                x: 30,
                y: 183,
                borderWidth: 2,
                borderColor: '#f0c2a0',
                borderRadius: 20,
              },
              {
                width: 634,
                height: 74,
                x: 59,
                y: 770,
                backgroundColor: '#fff',
                opacity: 0.5,
                zIndex: 100,
              },
            ],
            texts: [
              {
                x: 30,
                y: 113,
                baseLine: 'top',
                text: '发现一个好物，推荐给你呀',
                fontSize: 38,
                color: '#080808',
              },
              {
                x: 92,
                y: 810,
                fontSize: 38,
                baseLine: 'middle',
                text: this.data.goodsDetail.name,
                width: 570,
                lineNum: 1,
                color: '#080808',
                zIndex: 200,
              },
              {
                x: 59,
                y: 895,
                baseLine: 'middle',
                text: [
                  {
                    text: '拼购价',
                    fontSize: 28,
                    color: '#ec1731',
                  },
                  {
                    text: '¥' + this.data.goodsDetail.priceDown,
                    fontSize: 38,
                    color: '#ec1731',
                    marginLeft: 15,
                  },
                  {
                    text: this.data.goodsDetail.skus[0].marketPrice ? ('¥' + this.data.goodsDetail.skus[0].marketPrice) : ' ',
                    fontSize: 28,
                    color: '#E0E3DA',
                    marginLeft: 15,
					textDecoration: 'line-through'
                  }
                ]
              },
              // {
              //   x: 522,
              //   y: 895,
              //   baseLine: 'middle',
              //   text: '已售' + this.data.goodsDetail.saleNum,
              //   fontSize: 28,
              //   color: '#929292',
              // },
              {
                x: 59,
                y: 945,
                baseLine: 'middle',
                text: [
                  {
                    text: this.data.goodsDetail.sellPoint,
                    fontSize: 28,
                    color: '#929292',
					width: 600,
					lineNum: 2
                  }
                ]
              },
              {
                x: 360,
                y: 1065,
                baseLine: 'top',
                text: '长按识别小程序码',
                fontSize: 38,
                color: '#080808',
              },
              {
                x: 360,
                y: 1123,
                baseLine: 'top',
                text: '超值好货快来购买',
                fontSize: 28,
                color: '#929292',
              },
            ],
            images: [
              {
                width: 634,
                height: 634,
                x: 59,
                y: 210,
                url: this.data.goodsDetail.picUrls[0],
              },
              {
                width: 220,
                height: 220,
                x: 92,
                y: 1020,
                url: qrCode,
              }
            ]
          }
          let userInfo = app.globalData.userInfo
          if (userInfo && userInfo.headimgUrl){//如果有头像则显示
            posterConfig.images.push({
              width: 62,
              height: 62,
              x: 30,
              y: 30,
              borderRadius: 62,
              url: userInfo.headimgUrl,
            })
            posterConfig.texts.push({
              x: 113,
              y: 61,
              baseLine: 'middle',
              text: userInfo.nickName,
              fontSize: 32,
              color: '#8d8d8d',
            })
          }
          this.setData({
            posterConfig: posterConfig,
            posterShow: true
          }, () => {
            Poster.create(false);    // 入参：true为抹掉重新生成
          })
        })
      })
  },
  //点击保存到相册
  savePoster: function () {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.posterUrl,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              /* 该隐藏的隐藏 */
              that.setData({
                shareShow: ''
              })
            }
          }, fail: function (res) {
            console.log(res)
          }
        })
      }
    })
  },
})
