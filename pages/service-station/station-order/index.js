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
		date: null,
		orderList: [],
		serviceStationId: null
	},
	onShow() {

	},
	onLoad: function(options) {
		var now = new Date();
		var year = now.getFullYear();
		var month = now.getMonth() + 1;
		var day = now.getDate();
		if (month < 10) {
			month = '0' + month;
		};
		if (day < 10) {
			day = '0' + day;
		};
		var formatDate = year + '-' + month + '-' + day;
		this.setData({
			date: formatDate,
			serviceStationId: options.serviceStationId
		})
		
		let that = this
		app.initPage()
			.then(res => {
				this.stationOrder()
			})
	},
	stationOrder() {
		app.api.stationOrder({
			dateStr: this.data.date,
			serviceStationId: this.data.serviceStationId
		})
			.then(res => {
				let orderList = res.data
				this.setData({
					orderList: orderList
				})
			})
	},
	refresh() {
		this.setData({
			orderList: []
		})
		this.stationOrder()
	},
	onPullDownRefresh() {
		// 显示顶部刷新图标
		wx.showNavigationBarLoading()
		this.refresh()
		// 隐藏导航栏加载框
		wx.hideNavigationBarLoading()
		// 停止下拉动作
		wx.stopPullDownRefresh()
	},
	bindDateChange(event) {
		this.setData({
			date: event.detail.value
		})
		this.stationOrder()
	}
})
