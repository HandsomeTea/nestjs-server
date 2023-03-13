// typeorm中叫实体：entity
// mongoose中叫model

// typeorm
// import { Column, Entity, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';
// @Entity()
// export class User extends BaseEntity {
//     @PrimaryGeneratedColumn()
//     id: number;

//     @Column({ type: 'varchar', name: 'name' })
//     name: string;
// }

// mongoose
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// @Schema()
// export class User {

//     @Prop()
//     name: string;
// }

// export type CatDocument = User & Document;
// export const CatSchema = SchemaFactory.createForClass(User);
