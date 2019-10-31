'use strict';

import chatModel from '../../models/wcbz/chat'
import BaseComponent from '../../prototype/baseComponent'
import formidable from 'formidable'
import dtime from 'time-formater'

class Chat extends BaseComponent{
	constructor(){
		super()
		this.addChat = this.addChat.bind(this);
		this.getChat = this.getChat.bind(this);
		this.getChatCount = this.getChatCount.bind(this);
		this.getChatDetail = this.getChatDetail.bind(this);
		this.deleteChat = this.deleteChat.bind(this);
	}
	//添加人员
	async addChat(req, res, next){
        let chat_id;
		try{
            chat_id = await this.getId('chat_id');
		}catch(err){
			console.log('获取id失败');
			res.send({
				type: 'ERROR_DATA',
				message: '获取数据失败'
			})
			return
		}
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			const newChat = {
                chat_id, // 飞机ID
                content: fields.content, // 内容
                createtime: dtime().format('YYYY-MM-DD HH:mm'), // 创建时间
                contentType: fields.contentType,        // 类型
                chatType: fields.chatType, // 单聊 群聊
                image_path: fields.image_path, // 图片
                fromuid: fields.fromuid,
                touid: fields.touid
			}
			try{
				//保存数据，并增加对应食品种类的数量
				const chat = new chatModel(newChat);
				await chat.save();
				res.send({
					status: 1,
					sussess: '添加成功'
				})
			}catch(err){
				console.log('写入数据库失败');
				res.send({
					status: 0,
					type: 'ERROR_SERVER',
					message: '添加失败',
				})
			}
		})
    }
    // 查询人员
	async getChat(req, res, next){
		const {limit = 2000, offset = 0} = req.query;
		try{
            const users = await chatModel.find({}, '-_id').limit(Number(limit)).skip(Number(offset));
            console.log(users);
			res.send({
				status: 1,
				data: users,
			})
		}catch(err){
			console.log('获取数据失败', err);
			res.send({
				status: 0,
				type: 'GET_DATA_ERROR',
				message: '获取数据失败'
			})
		}
    }
    // 查询人员条数
    async getChatCount(req, res, next){
		try{
            console.log('222');
			const count = await chatModel.count()
			res.send({
				status: 1,
				count,
			})
		}catch(err){
			console.log('获取数量失败', err);
			res.send({
				status: 0,
				type: 'ERROR_GET_ADMIN_COUNT',
				message: '获取数量失败'
			})
		}
    }
    // 获取人员详情
	async getChatDetail(req, res, next){
        console.log("--------", req.query);
		const fromuid = req.query.fromuid;
		const touid = req.query.touid;
		// if (!chat_id || !Number(chat_id)) {
		// 	console.log('获取ID错误');
		// 	res.send({
		// 		status: 0,
		// 		type: 'ERROR_PARAMS',
		// 		message: 'ID参数错误',
		// 	})
		// 	return
		// }
		try{
            const chat = await chatModel.find({fromuid,touid});
            res.send({
				status: 1,
				data: chat,
			})
		}catch(err){
			console.log('获取人员详情失败', err);
			res.send({
				status: 0,
				type: 'GET_DATA_ERROR',
				message: '获取人员详情失败'
			})
		}
    }
    // 删除人员
    async deleteChat(req, res, next){
        console.log(req.params);
		const chat_id = req.params.chat_id;
		if (!chat_id || !Number(chat_id)) {
			console.log('chat_id参数错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: 'chat_id参数错误',
			})
			return
		}
		try{
			await chatModel.findOneAndRemove({chat_id});
			res.send({
				status: 1,
				success: '删除成功',
			})
		}catch(err){
			console.log('删除失败', err);
			res.send({
				status: 0,
				type: 'DELETE_RESTURANT_FAILED',
				message: '删除失败',
			})
		}
	}
}

export default new Chat()