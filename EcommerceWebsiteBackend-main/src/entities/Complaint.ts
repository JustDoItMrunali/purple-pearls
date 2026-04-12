import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

export enum ComplaintStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved",
}

@Entity("complaint")
export class Complaint {
  @PrimaryGeneratedColumn()
  complaint_id!: number;

  @Column()
  subject!: string;

  @Column({ type: "text" })
  message!: string;

  @Column({
    type: "simple-enum",
    enum: ComplaintStatus,
    default: ComplaintStatus.OPEN,
  })
  status!: ComplaintStatus;

  @Column({ type: "text", nullable: true })
  adminResponse!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;
}
