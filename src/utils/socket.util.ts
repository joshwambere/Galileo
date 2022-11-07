class SocketUtil{
    private users:Array<any> = [];
    public userJoin =(id, username, room, user_id)=> {
        const user = { id, username, room, user_id };
        this.users.forEach((item,index)=>{
            if (item.id==id){
                this.users.splice(index,1)
            }
        })
        this.users.findIndex((item) => (item.id === id && item.user_id === user_id && item.room === room)) ===-1 ? this.users.push(user) : null;
        return user;
    }
    public getRoomUsers = (room)=> {
        return this.users.filter(user => user.room === room);
    }

    public getCurrentUser =(id)=> {
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
