import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group, GroupDocument } from './schemas/group.schema';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name)
    private readonly groupModel: Model<GroupDocument>,
  ) {}

  async create(createGroupDto: CreateGroupDto) {
    const group = new this.groupModel(createGroupDto);
    return await group.save();
  }

  async findAll(joinType?: 'public' | 'private') {
    const query: Record<string, any> = {};
    if (joinType) {
      query.joinType = joinType;
    }

    return await this.groupModel
      .find(query)
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  async findOne(id: string) {
    const group = await this.groupModel.findById(id).lean().exec();
    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
    return group;
  }

  async update(id: string, updateGroupDto: UpdateGroupDto) {
    const updated = await this.groupModel.findByIdAndUpdate(
      id,
      updateGroupDto,
      {
        new: true,
        useFindAndModify: false,
      },
    );
    if (!updated) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
    return updated;
  }

  async updateMembers(id: string, members: string[]) {
    const group = await this.groupModel.findByIdAndUpdate(
      id,
      { members },
      { new: true, useFindAndModify: false },
    );
    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
    return group;
  }

  async updateStatus(id: string, status: 'active' | 'inactive' | 'deleted') {
    return await this.groupModel.findByIdAndUpdate(
      id,
      { status },
      { new: true, useFindAndModify: false },
    );
  }

  async remove(id: string) {
    const deleted = await this.groupModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
    return deleted;
  }
}
