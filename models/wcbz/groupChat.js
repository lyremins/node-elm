'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const groupChatSchema = new Schema({
    chatGroup_id: Number, // 群组id
    name: String, // 群组名称
    person: [], // 群组人员
    create_time: String, // 创建时间
})

const ChatGroup = mongoose.model('ChatGroup', groupChatSchema);

export default ChatGroup