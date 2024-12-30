# IRC-Style WebSocket Chatroom

## Overview

A real-time chat application built with Node.js and WebSockets, enabling persistent bidirectional communication between the server and connected clients. The application features a modern, IRC-inspired interface with command-based interactions.

## Features

- Real-time messaging using WebSocket technology
- Nickname system for user identification
- Automatic join/leave notifications
- Command-based interactions

## Commands

The chat system supports several commands:

```jsx
/nick <name> - Change your nickname
/list - View all connected users
/me <action> - Perform an action in third person
/help - Display available commands
```

## Technical Stack

- Node.js
- Express.js
- WebSocket (ws)
- Parcel bundler
- Nodemon for development

## Implementation Details

The application uses a single WebSocket server instance to manage all client connections. Each client connection is stored in a Map structure with unique identifiers. The server handles message broadcasting, nickname management, and command processing.

The client-side interface is built with JavaScript and HTML, providing a clean and responsive chat experience. All communication happens in real-time through WebSocket connections, eliminating the need for polling mechanisms.

## Technical Considerations

- Implements pure WebSocket communication without polling
- Maintains lightweight dependencies
- Supports concurrent development with hot-reloading
- Handles connection states and user management efficiently

## Future Enhancements

- Direct messaging system between users
- Public hosting capabilities
- Enhanced user interface with Bootstrap integration
- Additional chat commands and features
