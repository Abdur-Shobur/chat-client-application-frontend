import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageSchema } from './schemas/message.schema';
import { MessageGateway } from './message.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
  ],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway],
  exports: [MessageService],
})
export class MessageModule {}
