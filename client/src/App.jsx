import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast'
import Layout from "./components/Layout";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import NewProject from "./pages/NewProject";
import ProjectDetail from "./pages/ProjectDetail";
import Profile from "./pages/Profile";

export default function App(){
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="login" element={<Login/>}/>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/feed" replace/>}/>
          <Route path="feed" element={<Feed/>}/>
          <Route path="projects/new" element={<NewProject/>}/>
          <Route path="projects/:id" element={<ProjectDetail/>}/>
          <Route path="profile" element={<Profile/>}/>
        </Route>
      </Routes>
    </Router>
  );
}