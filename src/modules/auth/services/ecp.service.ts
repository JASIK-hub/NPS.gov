import { Injectable, UnauthorizedException } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
@Injectable()
export class EcpService {
  constructor(private readonly httpService: HttpService){}

 async verifyEcp(cms: string) {
    const url = 'http://ncanode:14579/cms/verify'; 
    
    try {
      const response = await this.httpService.axiosRef.post(url, {
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
