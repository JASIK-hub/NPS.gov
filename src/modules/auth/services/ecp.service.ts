import { Injectable, UnauthorizedException } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { ConfigService } from "@nestjs/config";
import { ENV_KEYS } from "src/core/config/env-keys";
@Injectable()
export class EcpService {
  constructor(
    private readonly configService:ConfigService,
    private readonly httpService: HttpService){}

 async verifyEcp(cms: string) {
  const url = this.configService.getOrThrow<string>(ENV_KEYS.NCANODE_URL);
    
    try {
      const response = await this.httpService.axiosRef.post(url+'/cms/verify', {
        cms: cms,
        checkOcsp: true, 
        checkCrl: false  
      });

      const data = response.data;

      if (data.status === 0) { 
        const subject = data.signers[0].subject;
        return {
          iin: subject.iin,
          firstName: subject.givenName || subject.commonName.split(' ')[1] || '',
          lastName: subject.surName || subject.commonName.split(' ')[0] || '',
          email: subject.email || null,
          
          bin: subject.bin || null,
          organizationName: subject.organizationName || null,
          
          position: subject.title || null
        };
      }
      throw new Error('Something went wrong');
    } catch (error) {
      throw new Error('Could not verify ECP key');
    }
  }
}
