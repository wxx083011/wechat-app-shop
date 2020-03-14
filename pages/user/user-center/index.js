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
		userInfo: {},
		serviceStationId: null
	},
	onShow() {
		this.setData({
			userInfo: app.globalData.userInfo
		})
		this.getServiceStationId()
	},
	onLoad() {

	},
	/**
	 * 小程序设置
	 */
	settings: function() {
		wx.openSetting({
			success: function(res) {
				console.log(res.authSetting)
			}
		})
	},
	agreeGetUser(e) {
		if (e.detail.errMsg == 'getUserInfo:ok') {
			app.api.userInfoSave(e.detail)
				.then(res => {
					let userInfo = res.data
					this.setData({
						userInfo: userInfo
					})
					app.globalData.userInfo = userInfo
					this.getServiceStationId()
				})
		}
	},
	toSuyuan() {
		wx.scanCode({
			success: (res) => {
				if (res.result) {
					wx.navigateTo({
						url: '/pages/web-view/web-view?webUrl=https://gyl.dapangzi.net/suyuan/' + res.result,
					})
				} else {
					wx.showToast({
						title: '条码识别识别,请重新扫码',
						icon: 'none',
						duration: 3000
					})
				}
			}
		})
	},
	getServiceStationId() {
		app.api.getServiceStationId({
				openId: this.data.userInfo.openId,
			})
			.then(res => {
				if(res.data){
					this.setData({
						serviceStationId: res.data
					})
				}
			})
	},
	toZhandian() {
		wx.navigateTo({
			url: '/pages/service-station/station-index/index?serviceStationId=' + this.data.serviceStationId,
		})
	}
})
