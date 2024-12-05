//TODO disallow * characters in aliases and messages in order for this to work




import express from "express";
import {WebSocketServer} from 'ws';

const app = express(); // <-- Our server
// Define our port as a constant
const PORT = 3008;
let threadCommentDivs = [];
let returnMessage = '';
let anonymous = "";

// Start the HTTP server
const server = app.listen(PORT, () =>
{
    console.log(`Server is listening on http://localhost:${PORT}`);
});

const wss = new WebSocketServer({server});

//Connection handling
wss.on('connection', (ws, req) =>
{
    const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;

    if(pathname === '/index')
    {
        console.log("New client connected to /index");

        ws.on('message', (message) => {
            // When we get a message
            console.log(`Received on /index ${message}`);
            message = String(message);

                anonymous = String(message).substring(1);
                console.log(`anonymous: ${anonymous}`)
                threadCommentDivs.push(`${anonymous}`);
                returnMessage += `${anonymous} has entered the chat*`;
                console.log(`Broadcasting Comments ${returnMessage}`)
                wss.clients.forEach(function each(client)
                {
                    client.send(returnMessage);
                });


        });


        // When the user disconnects (close the tab), they have closed the web socket
        ws.on("close", () => {
            console.log("Client disconnected from /index");
        });
    }
    else if(pathname === '/home')
    {
        console.log("New client connected to /home");
        wss.clients.forEach(function each(client)
        {
            client.send(returnMessage);
        });
        ws.on('message', (message) => {

            // When we get a message
            console.log(`Received on /home ${message}`);


            if(message.length < 150){
                threadCommentDivs.push(`${String(message)}`);
                returnMessage += `${String(message)}*`;




                console.log(`Broadcasting Comments ${returnMessage}`)
                wss.clients.forEach(function each(client) {client.send(returnMessage);});
            }

        });

        // When the user disconnects (close the tab), they have closed the web socket
        ws.on("close", () => {
            console.log("Client disconnected from /chatroom");
        });
    }
    else
    {
        ws.close();
        console.error(`Connection attempted on invalid path: ${pathname}`);
    }
});



