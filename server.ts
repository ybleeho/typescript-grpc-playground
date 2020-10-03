import grpc from 'grpc';
import { IUserServiceServer, UserServiceService } from './user_grpc_pb';
import { User, GetUserByAgeResponse, GetUserByAgeRequest } from './user_pb';
const server = new grpc.Server();

const allUsers: User.AsObject[] = [
    {
        name: 'leeho',
        age: 15,
        email: 'ybleeho@gmail.com'
    },
    {
        name: 'leeho',
        age: 20,
        email: 'ybleeho2@gmail.com'
    },
    {
        name: 'leeho',
        age: 30,
        email: 'ybleeho3@gmail.com'
    },
]

class UserService implements IUserServiceServer {
    public getUserByAge(
        call: grpc.ServerUnaryCall<GetUserByAgeRequest>,
        callback: grpc.sendUnaryData<GetUserByAgeResponse>
    ): void {
        const {request} = call;
        const age = request.getAge();
        const users = allUsers.filter(user => user.age >= age);
        const response = new GetUserByAgeResponse();
        const result: User[] = [];
        for(const user of users) {
            const userGrpc: User = new User();
            userGrpc.setName(user.name);
            userGrpc.setAge(user.age);
            userGrpc.setEmail(user.email);
            result.push(userGrpc);
        }
        response.setUsersList(result);
        callback(null, response);
    }
}

server.addService<IUserServiceServer>(UserServiceService, new UserService());
server.bind('0.0.0.0:3302', grpc.ServerCredentials.createInsecure());
server.start()