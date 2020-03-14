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
			size: 10,
			ascs: '', //升序字段
			descs: '',
			type: '0'
		},
		parameter: {},
		loadmore: true,
		ztArray: [],
		select: false,
		showSetting: false
	},
	onLoad(options) {
		if (options.select) {
			this.setData({
				select: true
			})
		}
	},
	onShow() {
		let _this = this;
		wx.getSetting({
			success(res) {
				if (res.authSetting['scope.userLocation']) {
					wx.getLocation({
						success(res2) {
							app.initPage().then(res => {
								_this.getServiceStation({
									longitude: res2.longitude,
									latitude: res2.latitude
								});
							})
						}
					})
				} else {
					wx.getLocation({
						success(res2) {
							app.initPage().then(res => {
								_this.getServiceStation({
									longitude: res2.longitude,
									latitude: res2.latitude
								});
							})
						}
					})
					_this.setData({
						showSetting : true
					})
				}
			},
			fail(res) {
				console.log(res)
			}
		})
	},
	getServiceStation(data) {
		app.api.getServiceStation(data)
			.then(res => {
				let ztArray = res.data
				this.setData({
					ztArray: ztArray,
					loadmore: false
				})
			})
	},
	selectUserAddress(e) {
		if (this.data.select) {
			let index = e.currentTarget.dataset.index
			let serviceStation = this.data.ztArray[index]
			var pages = getCurrentPages(); // 获取页面栈
			var currPage = pages[pages.length - 1]; // 当前页面
			var prevPage = pages[pages.length - 2]; // 上一个页面
			prevPage.setData({
				serviceStation: serviceStation
			})
			wx.navigateBack()
		}
	},
	openSetting(){
		let _this = this;
		wx.openSetting({
			success(res) {
				if (res.authSetting["scope.userLocation"]) {
					_this.setData({
						showSetting : false
					})
					wx.getLocation({
						success(res2) {
							app.initPage().then(res => {
								_this.getServiceStation({
									longitude: res2.longitude,
									latitude: res2.latitude
								});
							})
						}
					})
				}
			},
			fail(res) {
				console.log(res)
				_this.setData({
					showSetting : true
				})
			}
		})
	}
})
