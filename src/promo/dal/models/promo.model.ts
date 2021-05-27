import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { User } from './users.model';

const TABLE_NAME = 'promo';

@Entity(TABLE_NAME)
export class Promo
{
    public static readonly TABLE_NAME = TABLE_NAME;

    @PrimaryColumn({ type: 'varchar', length: 12 })
    public promocode!: string;

    @Column({ type: 'bigint', unsigned: true, nullable: false })
    public holder_id!: string;

    @Column({ type: 'datetime', nullable: true, default: null })
    public activated_at!: Date | null;

    @Column({ type: 'datetime', nullable: false })
    public created_at!: Date;



    // RELATIONS
    @OneToOne(() => User, user => user.ID)
    @JoinColumn({ name: 'holder_id' })
    public holder!: User | null;
    // RELATIONS
}
