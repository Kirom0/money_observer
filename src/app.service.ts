import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users/schemas/user.schema';
import { Model } from 'mongoose';
import { RecordDto } from './dto/record.dto';
import { Record, RecordDocument } from './records/schemas/record.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Record.name) private recordModel: Model<RecordDocument>,
  ) {}

  async auth(userDto: UserDto) {
    const { user_id, access_token, token } = userDto;
    const user = await this.userModel.findOne({ user_id }).exec();

    if (user === null) {
      return new this.userModel(userDto).save();
    }

    user.access_token = access_token;
    user.token = token;
    console.log('db auth: ', user);
    return user.save();
  }

  async getAuth(token: string): Promise<UserDto | null> {
    let res = await this.userModel.findOne({ token }).exec();
    if (res) {
      res = await this.refreshBalance(res.user_id);
    }
    return res;
  }

  async refreshBalance(user_id) {
    const userDoc = await this.userModel.findOne({ user_id }).exec();
    let balance = 0;
    const records = await this.recordModel.find({ user_id });
    records.forEach((record) => {
      balance += record.amount;
    });
    userDoc.balance = balance;
    return userDoc.save();
  }

  async recordNew(
    recordDto: RecordDto,
    user_id: number,
  ): Promise<RecordDocument> {
    return new this.recordModel({
      ...recordDto,
      user_id,
      order: (await this.recordModel.find({ date: recordDto.date })).length + 1,
    }).save();
  }

  async recordGet(
    user_id: number,
    from: string,
    to: string,
  ): Promise<RecordDocument[]> {
    const from_d = new Date(from);
    const to_d = new Date(to);
    const records = await this.recordModel.find({ user_id });
    const needRecords: RecordDocument[] = [];
    records.forEach((record: RecordDocument) => {
      const _d = new Date(record.date);
      if (from_d <= _d && _d <= to_d) {
        needRecords.push(record);
      }
    });
    needRecords.sort(compareRecords);
    return needRecords;
  }

  async recordUpdate(recordId, changes) {
    const doc: RecordDocument = await this.recordModel.findById(recordId);
    if (changes.order && changes.order !== doc.order) {
      const records = await this.recordModel
        .find({ date: doc.date })
        .sort({ order: 'asc' });
      if (changes.order < doc.order) {
        records.forEach((record) => {
          if (
            record._id !== doc._id &&
            changes.order <= record.order &&
            record.order < doc.order
          ) {
            console.log(record.order);
            record.order += 1;
            record.save();
          }
        });
      } else {
        records.forEach((record) => {
          if (
            record._id !== doc._id &&
            doc.order < record.order &&
            record.order <= changes.order
          ) {
            record.order -= 1;
            record.save();
          }
        });
      }
    }
    Object.keys(changes).forEach((key) => {
      doc[key] = changes[key];
    });
    return doc.save();
  }

  getHello(): string {
    return 'Hello World!!!';
  }
}

function compareRecords(a: RecordDocument, b: RecordDocument): number {
  if (a.date < b.date || (a.date === b.date && a.order < b.order)) {
    return -1;
  }
  if (a.date > b.date || (a.date === b.date && a.order > b.order)) {
    return 1;
  }
  return 0;
}
