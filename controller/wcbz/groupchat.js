'use strict';

import groupChatModel from '../../models/wcbz/groupChat'
import BaseComponent from '../../prototype/baseComponent'
import formidable from 'formidable'
import dtime from 'time-formater'

class groupChat extends BaseComponent{
	constructor(){
		super()
		this.addGroupChat = this.addGroupChat.bind(this);
		this.getGroupChat = this.getGroupChat.bind(this);
    }
	//添加人员
	async addGroupChat(req, res, next){
        let chatGroup_id;
		try{
            chatGroup_id = await this.getId('chatGroup_id');
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
                chatGroup_id, // 飞机ID
                name: fields.name, // 内容
                createtime: dtime().format('YYYY-MM-DD HH:mm'), // 创建时间
                person: fields.person       // 类型
			}
			try{
				//保存数据，并增加对应食品种类的数量
				const chat = new groupChatModel(newChat);
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
	async getGroupChat(req, res, next){
		const {limit = 2000, offset = 0} = req.query;
		try{
            const users = await groupChatModel.find({}, '-_id').limit(Number(limit)).skip(Number(offset));
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
}

export default new groupChat()