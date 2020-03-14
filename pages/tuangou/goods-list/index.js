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
			size: 10,
			ascs: '', //升序字段
			descs: ''
		},
		parameter: {},
		loadmore: true,
		goodsList: [],
		tgList: [],
		countObj: {},
		price: '',
		sales: '',
		createTime: '',
		title: '',
		totalPrice: '0',
		msg: null
	},
	deleteCount(event) {
		let index = event.target.dataset.index
		let skuId = event.target.dataset.skuid
		let i = null;
		this.data.goodsList.forEach(function(goods, index) {
			if (goods.skuId == skuId) {
				i = index;
				return;
			}
		})
		let quantity = Number(this.data.goodsList[i].count || 0)
		if (quantity > 0) {
			let countObj = this.data.countObj
			countObj[skuId] = quantity - 1
			this.setData({
				[`goodsList[${i}].count`]: quantity - 1,
				countObj: countObj
			})
			this.totalNum()
			this.totalPrice()
		}
	},
	addCount(event) {
		let index = event.target.dataset.index
		let skuId = event.target.dataset.skuid
		let i = null;
		this.data.goodsList.forEach(function(goods, index) {
			if (goods.skuId == skuId) {
				i = index;
				return;
			}
		})
		let quantity = Number(this.data.goodsList[i].count || 0)
		let countObj = this.data.countObj
		countObj[skuId] = quantity + 1
		this.setData({
			[`goodsList[${i}].count`]: quantity + 1,
			countObj: countObj
		})
		this.totalNum()
		this.totalPrice()
	},
	totalNum() {
		let totalNum = 0
		this.data.goodsList.map((item) => {
			if (item.count) {
				totalNum = totalNum + item.count
			}
		})
		this.setData({
			totalNum
		})
	},
	totalPrice() {
		let totalPrice = 0
		this.data.goodsList.map((item) => {
			if (item.count) {
				totalPrice = totalPrice + item.salesPrice * item.count
			}
		})
		totalPrice = totalPrice.toFixed(2); 
		this.setData({
			totalPrice
		})
	},
	onLoad(options) {
		if (options.title) {
			wx.setNavigationBarTitle({
				title: options.title
			})
		}
		if (options.categoryId) {
			this.setData({
				['parameter.categoryId']: options.categoryId
			})
		}
		app.initPage()
			.then(res => {
				this.goodsPage()
			})
	},
	goodsPage() {
		app.api.getTgGoods(Object.assign({},
				this.data.page,
				util.filterForm(this.data.parameter)
			))
			.then(res => {
				let tgList = res.data;
				if(res.msg){
					this.setData({
						msg: res.msg
					})
				}
				this.setData({
					tgList: tgList
				})
				let goodsList = [];
				tgList.forEach(function(item, index) {
					goodsList = goodsList.concat(item.children)
				})
				this.setData({
					goodsList: goodsList,
					loadmore: false
				})
			})
	},
	onReachBottom() {
		if (this.data.loadmore) {
			this.setData({
				['page.current']: this.data.page.current + 1
			})
			this.getTgGoods()
		}
	},
	relod() {
		this.setData({
			loadmore: true,
			goodsList: [],
			['page.current']: 1
		})
		this.goodsPage()
	},
	orderConfirm() {
		let params = []
		let shoppingCartData = this.data.goodsList
		shoppingCartData.forEach(function(shoppingCart, index) {
			if (shoppingCart.count && shoppingCart.count > 0) {
				let param = {
					spuId: shoppingCart.spuId,
					skuId: shoppingCart.skuId,
					quantity: shoppingCart.count,
					salesPrice: shoppingCart.salesPrice,
					spuName: shoppingCart.name,
					specInfo: '',
					picUrl: shoppingCart.picUrl ? shoppingCart.picUrl : ''
				}
				params.push(param)
			}
		})
		if (params.length > 0) {
			// /* 把参数信息异步存储到缓存当中 */
			wx.setStorage({
				key: 'param-orderConfirm',
				data: params
			})
			wx.navigateTo({
				url: '/pages/order/order-confirm/index'
			})
		}
	}
})
