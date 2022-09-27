class SocketUtil{
    private users:Array<any> = [];
    public userJoin =(id, username, room)=> {
        const user = { id, username, room };

        this.users.push(user);

        return user;
    }
    public getRoomUsers = (room)=> {
        return this.users.filter(user => user.room === room);
    }

    public getCurrentUser =(id)=> {
        console.log("!!!!!!!!!!!!!")
        console.log(this.users)
        console.log(id)
        return this.users.find(user => user.id === id);
    }

    public userLeave = (id)=> {
        const index = this.users.findIndex(user => user.id === id);

        if (index !== -1) {
            return this.users.splice(index, 1)[0];
        }
    }
}

export default SocketUtil;
