'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const chatSchema = new Schema({
	chat_id: Number,
	content: String, // 内容
    createtime: String, // 发送时间
    contentType: String, // 类型 0文本 1图片
    chatType: String , // 单聊 群聊
    image_path: { type: String, default: "" }, // 图片
    fromuid: Number, // 发送人uid
    touid: Number, // 接受人uid
})

const Chat = mongoose.model('Chat', chatSchema);

export default Chat