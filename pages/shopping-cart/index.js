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
      size: 50,
      ascs: '',//升序字段
      descs: 'create_time'
    },
    parameter: {},
    loadmore: true,
    operation: true,
    shoppingCartData: [],
    shoppingCartDataInvalid: [],
    isAllSelect: false,//全选
    selectValue: [],
    settlePrice: 0, //结算金额
    goodsDetail: [],
    goodsSpecData: [],
    modalSku: false,
    modalSkuType: '1',
    shoppingCartSelect: [],
    skuData: []
  },
  onShow() {
    app.initPage()
      .then(res => {
        this.shoppingCartPage()
      })
  },
  onLoad: function () {

  },
  //管理按键事件
  operation() {
    this.setData({
      operation: !this.data.operation
    })
    this.checkboxHandle(this.data.selectValue)
  },
  //加载数据
  shoppingCartPage(){
    app.api.shoppingCartPage(this.data.page)
      .then(res => {
        let shoppingCartData = []
        //过滤出失效商品
        let shoppingCartDataInvalid = []
        res.data.records.forEach(function (shoppingCart, index) {
          if (!shoppingCart.goodsSpu || shoppingCart.goodsSpu.shelf == '1'){//下架或删除了
            shoppingCartDataInvalid.push(shoppingCart)
          }else{
            shoppingCartData.push(shoppingCart)
          }
        })
        this.setData({
          shoppingCartData: shoppingCartData,
          shoppingCartDataInvalid: shoppingCartDataInvalid,
          loadmore: false
        })
        let selectValue = this.data.selectValue
        if (selectValue.length > 0) {
          this.checkboxHandle(selectValue)
        }
      })
  },
  //数量变化
  cartNumChang(e) {
    let index = e.target.dataset.index
    let shoppingCart = this.data.shoppingCartData[index]
    let quantity = Number(e.detail)
    this.setData({
      [`shoppingCartData[${index}].quantity`]: quantity
    })
    this.shoppingCartEdit({
      id: shoppingCart.id,
      quantity: quantity
    })
    this.countSelect()
  },
  shoppingCartEdit(parm){
    app.api.shoppingCartEdit(parm)
  },
  //收藏
  userCollectAdd(){
    let selectValue = this.data.selectValue
    let shoppingCartData = this.data.shoppingCartData
    let selectSpuValue = []
    shoppingCartData.forEach(function (shoppingCart, index) {
      let selectValueIndex = selectValue.indexOf(shoppingCart.id)
      if (selectValueIndex > -1) {
        selectSpuValue.push(shoppingCart.spuId)
      }
    })
    app.api.userCollectAdd({
      type: '1',
      relationIds: selectSpuValue
    })
      .then(res => {
        wx.showToast({
          title: '收藏成功',
          icon: 'success',
          duration: 2000
        })
      })
  },
  shoppingCartDel(){
    let selectValue = this.data.selectValue
    let that = this
    if (selectValue.length > 0){
      wx.showModal({
        content: '确认将这' + selectValue.length+'个宝贝删除',
        cancelText: '我再想想',
        confirmColor: '#ff0000',
        success(res) {
          if (res.confirm) {
            app.api.shoppingCartDel(selectValue)
              .then(res => {
                that.setData({
                  selectValue: [],
                  isAllSelect: false,
                  settlePrice: 0
                })
                that.shoppingCartPage()
              })
          }
        }
      })
    }
  },
  clearInvalid(){
    let selectValue = []
    let that = this
    this.data.shoppingCartDataInvalid.forEach(function (shoppingCart, index) {
      selectValue.push(shoppingCart.id)
    })
    wx.showModal({
      content: '确认清空失效的宝贝吗',
      cancelText: '我再想想',
      confirmColor: '#ff0000',
      success(res) {
        if (res.confirm) {
          app.api.shoppingCartDel(selectValue)
            .then(res => {
              that.setData({
                shoppingCartDataInvalid: []
              })
            })
        }
      }
    })
  },
  checkboxHandle(selectValue){
    let that = this
    let shoppingCartData = this.data.shoppingCartData
    let isAllSelect = true
    if (selectValue.length > 0) {
      let shoppingCartIds = []
      shoppingCartData.forEach(function (shoppingCart, index) {
        shoppingCartIds.push(shoppingCart.id)
        let selectValueIndex = selectValue.indexOf(shoppingCart.id)
        if (selectValueIndex > -1) {
          if (!that.data.operation){
            shoppingCart.checked = true
          }else{//如果是购买操作，需过滤不符商品
            if (shoppingCart.goodsSku
              && shoppingCart.quantity <= shoppingCart.goodsSku.stock) {
              shoppingCart.checked = true
            } else {
              isAllSelect = false
              shoppingCart.checked = false
              selectValue.splice(selectValueIndex, 1)
            }
          }
        } else {
          shoppingCart.checked = false
        }
      })
      selectValue.forEach(function (obj, index) {
        if (shoppingCartIds.indexOf(obj) <= -1) {
          selectValue.splice(index, 1)
        }
      })
    }else{
      isAllSelect = false
      shoppingCartData.forEach(function (shoppingCart, index) {
        shoppingCart.checked = false
      })
    }
    this.setData({
      shoppingCartData: shoppingCartData,
      isAllSelect: isAllSelect,
      selectValue: selectValue
    })
    this.countSelect()
  },
  checkboxChange: function (e) {
    this.checkboxHandle(e.detail.value)
  },
  checkboxAllChange(e) {
    var value = e.detail.value;
    if (value.length > 0) { 
      this.setAllSelectValue(true) 
    }else { 
      this.setAllSelectValue(false) 
    }
  },
  setAllSelectValue(status) {
    let shoppingCartData = this.data.shoppingCartData
    let selectValue = []
    let that = this
    if (shoppingCartData.length > 0) {
      if (status) {
        shoppingCartData.forEach(function (shoppingCart, index) {
          if (!that.data.operation) {
            selectValue.push(shoppingCart.id)
          } else {//如果是购买操作，需过滤不符商品
            if (shoppingCart.goodsSku
              && shoppingCart.quantity <= shoppingCart.goodsSku.stock) {
              selectValue.push(shoppingCart.id)
            }
          } 
        })
      }
      this.checkboxHandle(selectValue)
    }
  },
  //计算结算值
  countSelect() {
    let selectValue = this.data.selectValue
    let settlePrice = 0
    if (selectValue.length <= 0) { 
      this.setData({ 
        settlePrice: settlePrice
      }) 
    }else {
      this.data.shoppingCartData.forEach(function (shoppingCart, index) {
        if (selectValue.indexOf(shoppingCart.id) > -1 
            && shoppingCart.goodsSku 
            && shoppingCart.quantity <= shoppingCart.goodsSku.stock) {
          settlePrice = Number(settlePrice) + Number(shoppingCart.quantity) * Number(shoppingCart.goodsSku.salesPrice)
        }
      })
      this.setData({ 
        settlePrice: settlePrice.toFixed(2) 
      })
    }
  },
  //更换规格
  changeSpecs(e){
    let spuId = e.currentTarget.dataset.spuid
    let index = e.currentTarget.dataset.index
    this.setData({
      goodsDetail: [],
      goodsSpecData: [],
      modalSku: true,
      shoppingCartSelect: this.data.shoppingCartData[index]
    })
    this.goodsGet(spuId)
    this.goodsSpecGet(spuId)
  },
  goodsGet(id) {
    app.api.goodsGet(id)
      .then(res => {
        let goodsDetail = res.data
        this.setData({
          goodsDetail: goodsDetail
        })
      })
  },
  goodsSpecGet(spuId) {
    app.api.goodsSpecGet({
      spuId: spuId
    })
      .then(res => {
        let goodsSpecData = res.data
        let shoppingCartSelect = this.data.shoppingCartSelect
        if (shoppingCartSelect.goodsSku) {
          //回显
          shoppingCartSelect.specs.forEach(function (spec, index) {
            goodsSpecData.forEach(function (goodsSpec, index) {
              if (spec.specId == goodsSpec.id) {
                goodsSpec.checked = spec.specValueId
              }
            })
          })
        }
        this.setData({
          goodsSpecData: goodsSpecData,
          skuData: shoppingCartSelect.goodsSku ? shoppingCartSelect.goodsSku : []
        })
      })
  },
  operateCartEvent() {
    this.shoppingCartPage()
  },
  //结算
  orderConfirm(){
    let params = []
    let shoppingCartData = this.data.shoppingCartData
    shoppingCartData.forEach(function (shoppingCart, index) {
      if (shoppingCart.checked && shoppingCart.goodsSku && shoppingCart.goodsSku.enable == '1'
        && shoppingCart.goodsSpu && shoppingCart.goodsSpu.shelf == '0'
        && shoppingCart.quantity <= shoppingCart.goodsSku.stock){
        let param = {
          spuId: shoppingCart.spuId,
          skuId: shoppingCart.skuId,
          quantity: shoppingCart.quantity,
          salesPrice: shoppingCart.goodsSku.salesPrice,
          spuName: shoppingCart.goodsSpu.name,
          specInfo: shoppingCart.specInfo,
          picUrl: shoppingCart.goodsSku.picUrl ? shoppingCart.goodsSku.picUrl : shoppingCart.goodsSpu.picUrls[0]
        }
        params.push(param)
      }
    })
    /* 把参数信息异步存储到缓存当中 */
    wx.setStorage({
      key: 'param-orderConfirm',
      data: params
    })
    wx.navigateTo({
      url: '/pages/order/order-confirm/index'
    })
  }
})
