import {render} from "express/lib/application.js";
let renderedComments = [];
const socket = new WebSocket("ws://localhost:3008/home");
socket.addEventListener('open', () =>
{
    console.log("Connected to WebSocket server /home");
});
socket.addEventListener('error', (error) =>
{
    console.error('WebSocket error: ', error); // A comma here prints out the error object, not concatenated, therefore we can see the drop down in the console.
});
socket.addEventListener('message', (event) =>
{
    const correspondence = String(event.data);
    if(correspondence.length > 0)
    {
        console.log(`${correspondence}`);
        renderComments(correspondence);

    }
});
const editAliasButton = document.getElementById('edit-alias-btn');
const editAliasDiv = document.getElementById('edit-alias');
const editAliasInput = document.getElementById('new-alias-input');
const leaveChatButton = document.getElementById('leave-chatroom-btn');
const aliasError = document.getElementById('edit-alias-error');
const editAliasLabel = document.querySelector('#compose-comments label');
const commentInput = document.getElementById('write-comment');
const commentTooLongError = document.getElementById('no');
const commentHasAsteriskError = document.getElementById('no1');
document.addEventListener("DOMContentLoaded", () =>
{
    if(!localStorage.getItem('alias'))
    {
        location.href = "/index";
    }
    editAliasButton.addEventListener('click', () =>
    {
        editAliasDiv.classList.remove('d-none');
    });
    leaveChatButton.addEventListener('click', () =>
    {
        userLeft();
        localStorage.clear();
        location.href = '/index';
    });
    editAliasInput.addEventListener('keyup', (e) =>
    {
        if(e.key === 'Enter')
        {
            if((editAliasInput.value.length > 8) && (editAliasInput.value.length <= 25) && !(editAliasInput.value.includes("*")) && !(editAliasInput.value.includes(" ")))
            {
                if (editAliasLabel.innerText !== String(localStorage.getItem('alias'))) {
                    editAliasLabel.innerText = String(localStorage.getItem('alias'));
                }
                aliasError.classList.add('d-none');
                const message = `${getAliasFromLocalStorage()} has left the chat*${editAliasInput.value} has entered the chat`;
                socket.send(message);
                localStorage.setItem('alias', editAliasInput.value);
                editAliasInput.value="";
            }
            else
            {
                aliasError.classList.remove('d-none');
            }
        }
    });

    commentInput.addEventListener('keyup', (e) =>
    {
        console.log("is this listener being fired?");
        e.preventDefault();
        console.log(commentInput.value);
        if(commentInput.value.length > 150)
        {
            commentTooLongError.classList.remove('d-none');
        }
        else
        {
            commentTooLongError.classList.add('d-none');
        }

        if(e.key === "*" || commentInput.value.includes("*"))
        {
            commentHasAsteriskError.classList.remove('d-none');
        }
        if(e.key === "Backspace" && !commentInput.value.includes("*"))
        {
            commentHasAsteriskError.classList.add('d-none');
        }
        else if(e.key === "Enter")
        {
            console.log('Enter key pressed in comment input box');
            if(commentInput.value.includes("*"))
            {
                commentHasAsteriskError.classList.remove('d-none');
            }
            if(commentInput.value.length > 150)
            {
                commentTooLongError.classList.remove("d-none");
            }
            if(commentInput.value.length<150 && !commentInput.value.includes("*"))
            {
                console.log("comment is valid");
                commentHasAsteriskError.classList.add('d-none');
                commentTooLongError.classList.add('d-none');
                substituteCommands(commentInput.value);
            }
        }
    });
    editAliasLabel.innerText = `${getAliasFromLocalStorage()}`;
});
function substituteCommands(input)
{
    let sendComment = false;
    console.log(`Inside substituteCommands(${input})`);
    if(input.includes("/"))
    {
        console.log(`${input} includes "/"`);
        let arr = input.split('/');
        console.log(`arr = ${arr}`);
        for(let i = 0; i < arr.length; i++)
        {
            console.log("substring: " + arr[i].substring(0,4));
            if(arr[i].substring(0, 4) === "nick")
            {

                console.log("substring is nick")
                // change user's nickname
                let chosenName = arr[i].substring(5);
                console.log(`Chosen name ${chosenName}`);
                if((chosenName.length > 8) && (chosenName.length <= 25) && !(chosenName.includes("*")))
                {
                    const message = `${getAliasFromLocalStorage()} has left the chat*${chosenName} has entered the chat`;
                    socket.send(message);
                    console.log("New chosen name is valid");
                    aliasError.classList.add('d-none');
                    localStorage.setItem('alias', chosenName);
                    commentInput.value="";
                    if (editAliasLabel.innerText !== String(localStorage.getItem('alias'))) {
                        editAliasLabel.innerText = String(localStorage.getItem('alias'));
                    }
                }
                else
                {
                    aliasError.classList.remove('d-none');
                }
            }
            else if(arr[i].substring(0,4) === "list")
            {
                console.log("substring is list");
                console.log("users:" + users);
                // print all connected users.
                commentInput.value = "";
                for(let i = 0; i < users.length; i++)
                {
                    let comment = "";
                    comment += `${users[i]}`;
                    commentInput.value = comment;
                }



            }
            else if(arr[i].substring(0, 2) === "me")
            {
                // Switch /me for alias
                console.log("substring is me")

                arr[i] = getAliasFromLocalStorage() + arr[i].substring(2);




                sendComment = true;

            }
            else if(arr[i].substring(0, 4) === "help")
            {
                // Display a list of available commands
                console.log("substring is help");
                let x = document.createElement('div');
                x.classList.add("returned-comments");
                x.textContent = "</nick newAlias>: Change your alias";
                document.getElementById('posted-comments').appendChild(x);


                let y = document.createElement('div');
                y.classList.add("returned-comments");
                y.textContent = "</list>: Show connected users";
                document.getElementById('posted-comments').appendChild(y);

                let z = document.createElement('div');
                z.classList.add("returned-comments");
                z.textContent = "</me>: Shortcut for your alias";
                document.getElementById('posted-comments').appendChild(z);

                let a = document.createElement('div');
                a.classList.add("returned-comments");
                a.textContent = "</help>: Show available commands";
                document.getElementById('posted-comments').appendChild(a);

            }
            else
            {
                //sendComment = true; << no
            }
        }


        commentInput.value = arr.join("");
    }
    else
    {
        sendComment = true;
    }

    if(sendComment)
    {
        commentToServer();

    }
}
function commentToServer()
{
    const message = `${getAliasFromLocalStorage()}: ${commentInput.value}`;
    socket.send(message);
    commentInput.value = '';
}
let users = [];
function userLeft()
{
    const message = `${getAliasFromLocalStorage()} has left the chat`;
    socket.send(message);

}

function getAliasFromLocalStorage()
{
    return String(localStorage.getItem("alias"));
}


function renderComments(messages) {
    const postedComments = document.getElementById('posted-comments');
    const messagesArray = messages.split('*');
    console.log(messagesArray);

    if(messagesArray.length !== renderedComments.length)
    {
        renderedComments = [];
        users = [];
        for(let i = 0; i < messagesArray.length; i++)
        {
            renderedComments.push(messagesArray[i]);
            console.log(messagesArray[i]);
            if(!messagesArray[i].includes(":"))
            {
                console.log("add username to users");

                let username = messagesArray[i].split(" ")[0];

                console.log(username);
                console.log(messagesArray[i].substring(messagesArray[i].indexOf(" ")+1));
                if(messagesArray[i].substring(messagesArray[i].indexOf(" ")+1) === "has entered the chat")
                {
                    console.log(`${username} has been added to USERS`)
                    users.push(username);
                }
                else if(messagesArray[i].substring(messagesArray[i].indexOf(" ")+1) === "has left the chat")
                {
                    let ind = users.indexOf(username);
                    users.splice(ind, 1);
                }
            }
        }
    }
    console.log(`Messages: ${messagesArray}\nMessagesLength: ${messagesArray.length}\nrenderedComments: ${renderedComments}\nrenderedCommentsLength: ${renderedComments.length}`);

    postedComments.innerHTML = ``;
    for(let i = 0; i < renderedComments.length; i++)
    {
        const threadDiv = postedComments;

        const comment = document.createElement('div');
        comment.classList.add("returned-comments");

        comment.textContent = `${messagesArray[i]}`;

        threadDiv.appendChild(comment);
    }
}

