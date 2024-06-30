export {};

declare global {
  namespace Express {
    interface Users {
      _id?: string;
      email?: string;
      password?: string;
      role?: 'default' | 'admin' | 'staff';
      fullName?: string;
      avatar?: Object;
      imageCover?: Object;
      phoneNumber?: string;
      authType?: 'local' | 'google' | 'facebook';
      isActive?: boolean;
      address?: string;
      oneTimePass?: Object;
      postLikes?: string;
      postDislikes?: string;
      postSaves?: string;
      amountBalance?: number;
    }
    interface AuthInfo {
      iss: string;
      role: string;
      data?: any;
      sub: string;
      iat: number;
      exp: number;
    }

    interface Request {
      queryValid?: any;
      user?: Users;
      authInfo?: AuthInfo;
      query: Object;
      body: Object;
    }

    interface FileArray {
      fileUpload: UploadedFile;
    }
  }
}
