const io = require('socket.io')(80);
var moment = require('moment');

let avatarColors = Array("secondary","primary","dark","success","danger","warning","info")
let userList = new Map()
let newUser;


console.log("Socket.IO server ready....");
io.on('connection', (socket) => {
    socket.on('addConUser',(data)=>{ 
        if(data.name == null)
            return;
        var initials = data.name.match(/\b\w/g) || [];
        initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();

        var color = avatarColors[Math.floor(Math.random() * avatarColors.length)]; 
        
        var date = moment().format('DD-MM-YYYY hh:mm:ss');

        newUser = {
            name: data.name, 
            avtxt: initials, 
            avaCol:color,
            lastLogin: date
        };
        
        userList.set(data.uid,newUser);
        console.log(Array.from(userList));
        io.emit('updatedUser',(Array.from(userList)));
    });
    socket.on('destoryUser',(data)=>{
        userList.delete(data);
        console.log(Array.from(userList));
        socket.broadcast.emit('updatedUser',(Array.from(userList)));
    });
});

console.log('frontend server started')