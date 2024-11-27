# Mental Map Editor

Mental Map Editor is a feature-rich React application for creating, editing, and managing mental maps. It leverages **React Flow**, **WebSockets**, and other modern technologies to provide real-time collaboration, dynamic node management, and intuitive user interactions.

## Features

- **Dynamic Node Management:**
  - Add, remove, and customize nodes interactively.
  - Supports custom node types with unique styling and interactivity.

- **Real-Time Collaboration:**
  - Synchronize changes across multiple users with WebSocket connections.
  - Receive updates and notifications for map edits in real-time.

- **Responsive UI:**
  - Built with TailwindCSS for a clean and adaptive interface.
  - Includes modals, toolbars, and actionable buttons for enhanced usability.

- **State Management:**
  - Track changes and prevent unsaved work from being lost.

- **Export and Share:**
  - Capture map snapshots with `html2canvas` and save as PNG.
  - Share maps via a dedicated sharing modal.

## Tech Stack

- **Frontend Framework:** React
- **State Management:** React Flow Renderer, React Context API
- **Styling:** TailwindCSS
- **Real-Time Communication:** WebSocket
- **Utilities:** React Toastify, html2canvas

## Installation

### Prerequisites

Ensure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/mental-map-editor.git
   cd mental-map-editor
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

4. Open the application in your browser at:
   ```
   http://localhost:3000
   ```

## Usage

1. Create a new map or load an existing map using the WebSocket connection.
2. Add nodes by clicking the **Add Node** button.
3. Customize node content via the built-in editor.
4. Connect nodes by dragging edges between them.
5. Save your progress using the **Save** button.
6. Share your map via the **Share Map** feature.

## Project Structure

```
mental-map-editor/
├── src/
│   ├── components/
│   │   ├── CompartirMapa.js
│   │   ├── MyCustomNode.js
│   │   └── NodeContent.js
│   ├── App.js
│   ├── MapaEditor.js
│   └── index.js
├── public/
│   └── index.html
├── tailwind.config.js
├── package.json
└── README.md
```

## Key Files

- **`MapaEditor.js`**: Core logic for managing maps, nodes, and WebSocket communication.
- **`MyCustomNode.js`**: Custom node component definition.
- **`CompartirMapa.js`**: Sharing functionality for maps.

## Environment Variables

Create a `.env` file in the root directory to configure the following:

```
REACT_APP_API_URL=<Your API URL>
REACT_APP_WEBSOCKET_URL=<Your WebSocket URL>
```

## Contributing

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature description"
   ```
4. Push the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

- [React Flow Renderer](https://reactflow.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [html2canvas](https://html2canvas.hertzen.com/)
- [React Toastify](https://fkhadra.github.io/react-toastify/)

