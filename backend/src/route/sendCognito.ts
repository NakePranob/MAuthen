import { FastifyRequest, FastifyReply } from 'fastify';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

AWS.config.update({ 
    accessKeyId: 'AKIA2ZIONE7M5BXHJUOI', // ใส่ Access Key ของคุณ
    secretAccessKey: 'yc51GiLWYhuGaTZ9pjgcHaJjGSqUyPrMJaA5ZEIx', // ใส่ Secret Key ของคุณ
    region: 'ap-southeast-2' 
});

const cognito = new AWS.CognitoIdentityServiceProvider();

async function signin(request: FastifyRequest, reply: FastifyReply) {
    const { email, password, client_id, redirectUri } = request.body as { email: string; password: string; client_id: string; redirectUri: string };

    if (!client_id) {
        return reply.status(400).send({ message: 'CLIENT_ID is not defined' });
    }

    const params = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: client_id,
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password
        }
    }

    try {
        const data = await cognito.initiateAuth(params).promise();
        if (data.AuthenticationResult) {
            // การล็อกอินสำเร็จ
            if (!redirectUri) {
                return reply.status(400).send({ message: 'Redirect URI is required' });
            }
            return reply.status(200).send({
                id_token: data.AuthenticationResult.IdToken,
                expires_in: data.AuthenticationResult.ExpiresIn,
                token_type: data.AuthenticationResult.TokenType,
                state: "QF2Dd8rzoX",
                redirectUri
            });
        } else {
            // เงื่อนไขอื่นที่ไม่ใช่การล็อกอินสำเร็จหรือ OTP
            return reply.status(400).send({ message: 'Unexpected response from Cognito', data });
        }
    } catch (error) {
        reply.status(400).send({ message: error })
    }
};

async function signup(request: FastifyRequest, reply: FastifyReply) {
    const { email, password, client_id } = request.body as {
        email: string,
        password: string,
        client_id: string
    };

    if (!client_id) {
        return reply.status(400).send({ message: 'CLIENT_ID is not defined' });
    }

    const params = {
        ClientId: client_id,
        Username: email,
        Password: password,
        UserAttributes: [
            {
                Name: 'email',
                Value: email
            }
        ]
    }

    try {
        const data = await cognito.signUp(params).promise();
        reply.status(200).send({ message: data })
    } catch (error) {
        reply.status(400).send({ message: error })
    }
};

// ใช้ได้แต่จะเป็น code ที่ cognito ส่งเมล
// async function confirmation(request: FastifyRequest, reply: FastifyReply) {
//     const { email, code, client_id } = request.body as {
//         email: string,
//         code: string,
//         client_id: string
//     };

//     if (!client_id) {
//         return reply.status(400).send({ message: 'CLIENT_ID is not defined' });
//     }

//     const params = {
//         ClientId: client_id,
//         ConfirmationCode: code,
//         Username: email
//     }

//     try {
//         const data = await cognito.confirmSignUp(params).promise();
//         reply.status(200).send({ message: data })
//     } catch (error) {
//         reply.status(400).send({ message: error })
//     }
// };

// ใช้ไม่ได้สิทธของ user iam ไม่อนุญาติให้เข้าถึง
async function confirmation(request: FastifyRequest, reply: FastifyReply) {
    const { email, code } = request.body as {
        email: string,
        code: string,
    };

    // if (!client_id) {
    //     return reply.status(400).send({ message: 'CLIENT_ID is not defined' });
    // }

    const params = {
        UserPoolId: 'ap-southeast-2_SoDKh4tLu', // ใส่ User Pool ID ของคุณ
        Username: email, // ใส่ Username ของผู้ใช้ที่ต้องการอัปเดต
        UserAttributes: [
          {
            Name: 'email_verified',
            Value: 'true', // ยืนยันอีเมล
          },
        ],
    };

    try {
        const data = await cognito.adminUpdateUserAttributes(params).promise();
        reply.status(200).send({ message: data })
    } catch (error) {
        reply.status(400).send({ message: error })
    }
};

async function logout(request: FastifyRequest, reply: FastifyReply) {
    const token = request.headers.authorization as string;

    const params = {
        AccessToken: token
    };

    try {
        await cognito.globalSignOut(params).promise();
        reply.status(200).send({ message: 'Logout successful' });
    } catch (error) {
        reply.status(400).send({ message: error })
    }
};

async function test(request: FastifyRequest, reply: FastifyReply) {
    try {
      // ใช้ async/await เพื่อรอผลลัพธ์
      const data = await new Promise((resolve, reject) => {
        cognito.describeUserPool(
          {
            UserPoolId: 'ap-southeast-2_SoDKh4tLu',
          },
          (error, data) => {
            if (error) {
              reject(error);
            } else {
              if (data?.UserPool?.Policies?.PasswordPolicy) {
                resolve(data.UserPool.Policies.PasswordPolicy);
              } else {
                reject(new Error('Unable to fetch password policy'));
              }
            }
          }
        );
      });
  
      // ส่งผลลัพธ์กลับไป
      reply.status(200).send({ message: data });
    } catch (error) {
      // จัดการข้อผิดพลาด
      reply.status(500).send({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }

// ฟังก์ชันแลกเปลี่ยน Authorization Code เป็น Token
async function exchangeAuthorizationCodeForTokens(request: FastifyRequest, reply: FastifyReply) {
    const { code, redirectUri, client_id } = request.body as {
        code: string;
        redirectUri: string;
        client_id: string;
    };

    if (!client_id) {
        return reply.status(400).send({ message: 'CLIENT_ID is required' });
    }

    const params = {
        AuthFlow: 'REFRESH_TOKEN_AUTH', // Use the correct flow here
        ClientId: client_id,
        AuthParameters: {
            CODE: code,
            REDIRECT_URI: redirectUri,
        }
    };

    try {
        const data = await cognito.initiateAuth(params).promise();
        if (data.AuthenticationResult) {
            reply.status(200).send({
                access_token: data.AuthenticationResult.AccessToken,
                id_token: data.AuthenticationResult.IdToken,
                refresh_token: data.AuthenticationResult.RefreshToken,
                expires_in: data.AuthenticationResult.ExpiresIn,
                token_type: data.AuthenticationResult.TokenType
            });
        }
    } catch (error) {
        reply.status(400).send({ message: error });
    }
};


export {
    signin,
    signup,
    confirmation,
    exchangeAuthorizationCodeForTokens,
    test,
    logout
};