import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Promo } from './promo.model';

const TABLE_NAME = 'users';

@Entity(TABLE_NAME)
export class User
{
    public static readonly TABLE_NAME = TABLE_NAME;

    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    public ID!: string;

    @Column({ type: 'varchar', length: 32, nullable: false })
    public firstname!: string;

    @Column({ type: 'date', nullable: true, default: null })
    public birthdate!: string | null; // YYYY-MM-DD

    @Column({ type: 'char', length: 12, nullable: false, unique: true })
    public phone!: string;

    @Column({ type: 'varchar', length: 32, nullable: true, default: null })
    public email!: string | null;

    @Column({ type: 'datetime', nullable: false })
    public created_at!: Date;



    // RELATIONS
    @OneToMany(() => Promo, (promo) => promo.holder)
    public promo!: Promo[];
    // RELATIONS
}
