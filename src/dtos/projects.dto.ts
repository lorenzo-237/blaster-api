import { IsBoolean, IsString } from 'class-validator';

export class NewVersionDto {
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsBoolean()
  released: boolean;
  @IsBoolean()
  obsolete: boolean;
}
