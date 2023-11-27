import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { User } from '../user/user.schema';

@Injectable()
export class AuthService {
  getUserPayload = (user: User) => {
    return {
      email: user.email,
      userType: user.userType,
      _id: user._id,
    };
  };

  getUserResponseBody = (user: User) => {
    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      fullname: user.fullname,
      avatar: user.avatar,
      dob: user.dob,
      userType: user.userType,
      verified: user.verified,
    };
  };

  async verifyFacebookToken(token: String): Promise<any> {
    const response = await axios.get(
      `https://graph.facebook.com/v14.0/me?fields=id,name,email,picture.type(large)&access_token=${token}`,
    );
    return (response && response.data) || null;
  }

  async verifyGoogleToken(token: String): Promise<any> {
    const response = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?access_token=${token}`,
    );
    console.log(response.data);
    return (response && response.data) || null;
  }
}
