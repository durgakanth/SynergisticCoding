// import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
// //import GitHubCorner from "./components/GitHubCorner"
// import Toast from "./components/toast/Toast"
// import EditorPage from "./pages/EditorPage"
// import HomePage from "./pages/HomePage"

// const App = () => {
//     return (
//         <>
//             <Router>
//                 <Routes>
//                     <Route path="/" element={<HomePage />} />
//                     <Route path="/editor/:roomId" element={<EditorPage />} />
//                 </Routes>
//             </Router>
//             <Toast /> {/* Toast component from react-hot-toast */}
//             {/* <GitHubCorner /> */}
//         </>
//     )
// }



// export default App



import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Toast from "./components/toast/Toast"
import EditorPage from "./pages/EditorPage"
import HomePage from "./pages/HomePage"
//import VideoChat from "./pages/VideoChat" // Import VideoChat
//import LocalVideo from "./pages/LocalVideo"
import RemoteVideo from "./pages/RemoteVideo"
//Code-Sync-main\client\src\components\Web RTC\VideoChat.tsx

const App = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/editor/:roomId" element={<EditorPage />} />
                </Routes>
            </Router>
              {/* <VideoChat /> */}
            <Toast /> 
         
             {/* <LocalVideo /> */}
             <RemoteVideo />
        </>
    )
}

export default App
