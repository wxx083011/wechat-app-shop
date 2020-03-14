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
		orderConfirmData: [],
		totalPrice: '--',
		goodsPrice: 0,
		logisticsPrice: 0,
		userAddress: null,
		serviceStation: null,
		orderSubParm: {
			paymentType: '1',
			logisticsType: 0
		},
		loading: false
	},
	onShow() {
		this.setData({
			totalPrice: this.data.goodsPrice,
			loading: false
		})
	},
	onLoad: function() {
		this.userAddressPage();
		this.getLatelyUseStation();
		// 本地获取参数信息
		let that = this
		wx.getStorage({
			key: 'param-orderConfirm',
			success: function(res) {
				let orderConfirmData = res.data
				let totalPrice = 0
				orderConfirmData.forEach(function(orderConfirm) {
					totalPrice = totalPrice + orderConfirm.salesPrice * orderConfirm.quantity
				})
				totalPrice = totalPrice.toFixed(2);
				that.data.goodsPrice = totalPrice;
				that.setData({
					totalPrice: totalPrice,
					orderConfirmData: orderConfirmData
				})
			}
		})
	},
	userAddressPage() {
		app.api.userAddressPage({
				searchCount: false,
				current: 1,
				size: 1,
				isDefault: '1'
			})
			.then(res => {
				let records = res.data.records
				if (records && records.length > 0) {
					this.setData({
						userAddress: records[0]
					})
				}
			})
	},
	getLatelyUseStation() {
		app.api.getLatelyUseStation({
				userId: app.globalData.userInfo.id
			})
			.then(res => {
				if (res.data) {
					this.setData({
						serviceStation: res.data
					})
				}
			})
	},
	userMessageInput(e) {
		this.setData({
			[`orderSubParm.userMessage`]: e.detail.value
		})
	},
	toMap() {
		wx.openLocation({
				latitude: 26.905328,
				longitude: 112.586408,
				scale: 18,
				name: '弘阳广场',
				address: '衡阳市蒸湘区弘阳广场（廖家湾公交站）'
			}
		);
	},
	//提交订单
	orderSub() {
		let userAddress = this.data.userAddress
		if (userAddress == null) {
			wx.showToast({
				title: '请选择收件人信息',
				icon: 'none',
				duration: 2000
			})
			return
		}
		let serviceStation = this.data.serviceStation
		if (serviceStation == null) {
			wx.showToast({
				title: '请选择提货点',
				icon: 'none',
				duration: 2000
			})
			return
		}
		let that = this
		this.setData({
			loading: true
		})
		let orderSubParm = this.data.orderSubParm
		orderSubParm.skus = this.data.orderConfirmData
		app.api.orderSub(Object.assign({}, {
					userAddressId: userAddress.id,
					serviceStationId: serviceStation.id,
					serviceStationJson: JSON.stringify(serviceStation)
				},
				orderSubParm
			))
			.then(res => {
				wx.redirectTo({
					url: '/pages/order/order-detail/index?callPay=true&id=' + res.data.id
				})
			}).catch(() => {
				this.setData({
					loading: false
				})
			})
	}
})
