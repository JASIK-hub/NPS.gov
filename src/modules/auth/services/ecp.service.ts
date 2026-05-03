import { Injectable, UnauthorizedException } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { ConfigService } from "@nestjs/config";
import { ENV_KEYS } from "src/core/config/env-keys";
import { extractGenderFromIin } from "../utils/extract-gender.util";
@Injectable()
export class EcpService {
  constructor(
    private readonly configService:ConfigService,
    private readonly httpService: HttpService){}

 async verifyEcp(cms: string,data:string) {
  const url = this.configService.getOrThrow<string>(ENV_KEYS.NCANODE_URL);
    try {
      const response = await this.httpService.axiosRef.post(url+'/cms/verify', {
        cms: cms,
        data,
        checkOcsp: true, 
        checkCrl: false  
      });

      const responseData = response.data;
      
      if (responseData.status === 200 && responseData.valid) { 
        const subject = responseData.signers[0].certificates[0];

        return {
          iin: subject.iin,
          bin: subject.bin || null,
          firstName: subject.givenName || subject.commonName.split(' ')[1] || '',
          lastName: subject.surName || subject.commonName.split(' ')[0] || '',
          email: subject.email || null,
          gender: extractGenderFromIin(subject.iin), 
          organizationName: subject.organization || null,
        };
      }
      throw new Error('Something went wrong');
    } catch (error:any) {
      throw new Error('Could not verify ECP key');
    }
  }
}
