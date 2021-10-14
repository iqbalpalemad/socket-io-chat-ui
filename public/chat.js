$(document).ready(() => {
    console.log("document ready")
    token = localStorage.getItem("token");
        if(!token){
            location.href = "/"
        }
    $(".current_user").text(localStorage.getItem("userName"));
    fetchConnectedUsers();
    const socket = io("http://localhost:5000");
    socket.on("connect", () => {
        socket.on('chatMessage', msg => {
            console.log(msg);
            userId  = localStorage.getItem("userId");
            if(msg.fromUserId == userId){
                appendOutgoingMessage(msg.message)
            }
            if(msg.toUserId == userId){
                appendIncomingMessage(msg.message)
            }
            
        });
    });

    $(".msg_send_btn").click(() => {
        message    = $(".write_msg").val().trim();
        fromUserId = localStorage.getItem("userId");
        toUserId   = $(".active_chat").find(".userId").val() 
        socket.emit('chatMessage', {message:message,fromUserId:fromUserId,toUserId:toUserId});
        appendOutgoingMessage(message)
        $(".write_msg").val("")
        $(".write_msg").focus();
    })

    $(document).on("click",".chat_list",(e) => {
        $(".chat_list").removeClass("active_chat");
        $(e.target).closest(".chat_list").addClass("active_chat");
        $(".incoming_msg").empty();
        getCompleteChat();
    })
})

const getCompleteChat = () => {
    selectedUser = $(".active_chat").find(".userId").val()
    sendAjax(`message/messageList/${selectedUser}`,'GET',{},localStorage.getItem("token"),(data) => {
        if(data.result){
            userId  = localStorage.getItem("userId");
            $.each(data.data.message,(key,value) => {
                if(value.fromUser == userId){
                    appendOutgoingMessage(value.body);
                }
                if(value.toUser == userId){
                    appendIncomingMessage(value.body);
                }
            })
        }
    })
}

const appendOutgoingMessage = (message) => {
    element = `<div class="outgoing_msg">
                <div class="sent_msg">
                    <p>${message}</p>
                </div>
              </div>`
    $(".incoming_msg").append(element);
}

const appendIncomingMessage = (message) => {
    element =`<div class="received_msg">
                <div class="received_withd_msg">
                    <p>${message}</p>
                </div>
              </div>`
    $(".incoming_msg").append(element);
}

const appendUser = (name,id) => {
    element = `<div class="chat_list">
                <div class="chat_people">
                    <div class="chat_ib">
                        <h5>${name || ""}</h5>
                        <input style="display: none;" value="${id}" class="userId">
                    </div>
                </div>
            </div>`
    $(".inbox_chat").append(element)
}

const fetchConnectedUsers = () => {
    sendAjax('connection/connectedUsers','GET',{},localStorage.getItem("token"),(data) => {
        if(data.result){
            userId  = localStorage.getItem("userId");
            console.log(userId);
            $.each(data.data.message,(key,value) => {
                if(value.sourceUserId._id == userId){
                    appendUser(value.targetUserId.name,value.targetUserId._id)
                }
                if(value.targetUserId._id == userId){
                    appendUser(value.sourceUserId.name,value.sourceUserId._id)
                }
            })

            $(".chat_list:first").click()
        }
    })
}