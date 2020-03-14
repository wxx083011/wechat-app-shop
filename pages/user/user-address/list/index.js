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
		tabCur: 1,
		orderStatus: [{
				value: '自提地址',
				key: '0'
			},
			{
				value: '快递地址',
				key: '1'
			}
		],
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
		userAddress: [],
		select: false
	},
	onLoad(options) {
		if (options.select) {
			this.setData({
				select: true
			})
		}
	},
	onShow() {
		app.initPage()
			.then(res => {
				this.userAddressPage()
			})
	},
	userAddressPage() {
		this.setData({
			['page.type']: this.data.tabCur
		})
		app.api.userAddressPage(this.data.page)
			.then(res => {
				let userAddress = res.data.records
				this.setData({
					userAddress: userAddress,
					loadmore: false
				})
			})
	},
	toAdd() {
		wx.setStorage({
			key: 'param-userAddressForm',
			data: []
		})
		if(this.data.tabCur == 0){
			wx.navigateTo({
				url: '/pages/tuangou/user-address/index'
			})
		}else{
			wx.navigateTo({
				url: '/pages/user/user-address/form/index'
			})
		}
	},
	toEdit(e) {
		let index = e.currentTarget.dataset.index
		let userAddressForm = this.data.userAddress[index]
		/* 把参数信息异步存储到缓存当中 */
		wx.setStorage({
			key: 'param-userAddressForm',
			data: userAddressForm
		})
		if(this.data.tabCur == 0){
			wx.navigateTo({
				url: '/pages/tuangou/user-address/index'
			})
		}else{
			wx.navigateTo({
				url: '/pages/user/user-address/form/index'
			})
		}
	},
	selectUserAddress(e) {
		if (this.data.select) {
			let index = e.currentTarget.dataset.index
			let userAddressForm = this.data.userAddress[index]
			var pages = getCurrentPages(); // 获取页面栈
			var currPage = pages[pages.length - 1]; // 当前页面
			var prevPage = pages[pages.length - 2]; // 上一个页面
			prevPage.setData({
				userAddress: userAddressForm,
				['orderSubParm.logisticsType']: this.data.tabCur
			})
			wx.navigateBack()
		}
	},
	tabSelect(e) {
		let dataset = e.currentTarget.dataset
		if (dataset.index != this.data.tabCur) {
			this.setData({
				tabCur: dataset.index,
				['parameter.status']: dataset.key
			})
			this.refresh()
		}
	},
	refresh() {
		this.setData({
			loadmore: true,
			orderList: [],
			['page.current']: 1
		})
		this.userAddressPage()
	}
})
