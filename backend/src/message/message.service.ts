import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { IMessage } from './interfaces/message.interface';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<IMessage>,
  ) {}

  create(createMessageDto: CreateMessageDto) {
    return this.messageModel.create(createMessageDto);
  }

  findAll() {
    return this.messageModel.find().sort({ createdAt: -1 }).exec();
  }
  async getMyInboxList(userId: string) {
    return this.messageModel.aggregate([
      {
        $match: {
          sender: new Types.ObjectId(userId),
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            chatType: '$chatType',
            receiver: '$receiver',
          },
          lastMessage: { $first: '$$ROOT' },
        },
      },
      {
        $lookup: {
          from: 'users', // assumes 'users' collection for personal chats
          localField: '_id.receiver',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      {
        $lookup: {
          from: 'groups', // assumes 'groups' collection for group chats
          localField: '_id.receiver',
          foreignField: '_id',
          as: 'groupInfo',
        },
      },
      {
        $project: {
          chatType: '$_id.chatType',
          receiverId: '$_id.receiver',
          lastMessage: {
            text: '$lastMessage.text',
            type: '$lastMessage.type',
            createdAt: '$lastMessage.createdAt',
          },
          userInfo: { $arrayElemAt: ['$userInfo', 0] },
          groupInfo: { $arrayElemAt: ['$groupInfo', 0] },
        },
      },
      {
        $sort: { 'lastMessage.createdAt': -1 },
      },
    ]);
  }

  async getChatMessages(
    chatType: 'personal' | 'group',
    userId: string,
    targetId: string,
  ) {
    const matchQuery =
      chatType === 'personal'
        ? {
            chatType: 'personal',
            $or: [
              {
                sender: new Types.ObjectId(userId),
                receiver: new Types.ObjectId(targetId),
              },
              {
                sender: new Types.ObjectId(targetId),
                receiver: new Types.ObjectId(userId),
              },
            ],
          }
        : {
            chatType: 'group',
            receiver: new Types.ObjectId(targetId),
          };

    return this.messageModel
      .find(matchQuery)
      .sort({ createdAt: 1 })
      .populate('sender', 'name avatar') // optional
      .exec();
  }

  findByChat(receiverId: string) {
    return this.messageModel.find({ receiver: receiverId }).exec();
  }

  findOne(id: string) {
    return this.messageModel.findById(id).exec();
  }

  update(id: string, updateMessageDto: UpdateMessageDto) {
    return this.messageModel.findByIdAndUpdate(id, updateMessageDto, {
      new: true,
    });
  }

  remove(id: string) {
    return this.messageModel.findByIdAndDelete(id);
  }
}
