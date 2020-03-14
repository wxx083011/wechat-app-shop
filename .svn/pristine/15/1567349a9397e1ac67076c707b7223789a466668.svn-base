/**
 * Copyright (C) 2018-2019
 * All rights reserved, Designed By www.joolun.com
 * 注意：
 * 本软件为www.joolun.com开发研制，未经购买不得使用
 * 购买后可获得全部源代码（禁止转卖、分享、上传到码云、github等开源平台）
 * 一经发现盗用、分享等行为，将追究法律责任，后果自负
 */
Component({
  properties: {
    max: {
      type: Number,
      value: 0
    },
    min: {
      type: Number,
      value: 0
    },
    stNum: {
      type: Number,
      value: 0
    },
    customClass:{
      type: String,
      value: ''
    }
  },
  data: {

  },
  methods: {
    stNumMinus() {
      this.setData({
        stNum: this.data.stNum - 1
      })
      this.triggerEvent('numChange', this.data.stNum)
    },
    stNumAdd() {
      this.setData({
        stNum: this.data.stNum + 1
      })
      this.triggerEvent('numChange', this.data.stNum)
    },
    numChange(e){
      this.triggerEvent('numChange', val)
    }
  }
})