import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

class Address {
  @IsString()
  @IsNotEmpty()
  readonly address!: string;

  @IsString()
  @IsNotEmpty()
  readonly city!: string;

  @IsString()
  @IsNotEmpty()
  readonly country!: string;

  @IsString()
  @IsNotEmpty()
  readonly email!: string;

  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsString()
  @IsNotEmpty()
  readonly zipcode!: string;

  @IsString()
  @IsNotEmpty()
  readonly phonenumber!: string;
}

export class PackageDto {
  @IsNotEmpty()
  readonly height!: number;

  @IsNotEmpty()
  readonly length!: number;

  @IsNotEmpty()
  readonly width!: number;

  @IsNotEmpty()
  readonly weight!: number;
}

class DropoffPickup {
  @ValidateNested()
  readonly dropoff!: Address;

  @ValidateNested()
  readonly pickup!: Address;
}

export class OrderDto extends DropoffPickup {
  @ValidateNested({ each: true })
  readonly packages!: PackageDto[];
}
