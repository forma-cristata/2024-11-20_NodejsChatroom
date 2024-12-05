
const socket = new WebSocket("ws://localhost:3008/index");
socket.addEventListener('open', () =>
{
    console.log("Connected to WebSocket server /index");
});

socket.addEventListener('error', (error) =>
{
    console.error('WebSocket error: ', error); // A comma here prints out the error object, not concatenated, therefore we can see the drop down in the console.
});

socket.addEventListener('message', (event) =>
{
    location.href = "/home";

});

const submitBtn = document.getElementById('submit-btn');
const aliasInput = document.getElementById('alias-input');
const error = document.getElementById('error');
document.addEventListener("DOMContentLoaded", () =>
{
    if(localStorage.getItem('alias'))
    {
        sendUserJoinedMessage(String(localStorage.getItem('alias')));
        location.href = "/home";
    }
    submitBtn.addEventListener('click', (e) =>
    {
        e.preventDefault();
        console.log("32");
        if(aliasInput.value.length > 8 && aliasInput.value.length <=25 && !aliasInput.value.includes("*") && !(aliasInput.value.includes(" ")))
        {
            console.log("35");
            error.classList.add('d-none');
            storeAliasLocally();
            sendUserJoinedMessage(aliasInput.value);
        }
        else
        {
            error.classList.remove("d-none");
        }
    });
    aliasInput.addEventListener('keyup', () =>
    {
        if(aliasInput.value.length > 8 && aliasInput.value.length <= 25 && !aliasInput.value.includes("*"))
        {
            error.classList.add('d-none');
        }
    });
});

function sendUserJoinedMessage(alias)
{
    const message = `*${alias}`;
    socket.send(message);
    aliasInput.value = '';

}
function storeAliasLocally()
{
    const alias = aliasInput.value;
    localStorage.setItem("alias", String(alias));
}