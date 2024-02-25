// import './App.css'
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Contests from "./pages/Contests";
import ProblemSet from "./pages/ProblemSet";
import Standings from "./pages/Standings";
import Help from "./pages/Help";
import QuestionPage from "./pages/QuestionPage";
import ContestDetail from "./pages/ContestDetail";
import UserProfile from "./pages/UserProfile";
import AdminProblemSet from "./pages/admin/AdminProblemSet";
import AdminContests from "./pages/admin/AdminContests";
import AdminQuestionPage from "./pages/admin/AdminQuestionPage";
import AdminContestDetail from "./pages/admin/AdminContestDetail";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/contests" element={<Contests />} />
          <Route path="/problemset" element={<ProblemSet />} />
          <Route path="/standings" element={<Standings />} />
          <Route path="/help" element={<Help />} />
          <Route path="/question/:questionId" element={<QuestionPage />} />
          <Route path="/contestdetail/:contestId" element={<ContestDetail />} />
          <Route path="/userprofile/:userId" element={<UserProfile />} />
          <Route path="/adminproblemset" element={<AdminProblemSet />} />
          <Route path="/admincontests" element={<AdminContests />} />
          <Route
            path="/adminquestion/:questionId"
            element={<AdminQuestionPage />}
          />
          <Route
            path="/admincontestdetail/:contestId"
            element={<AdminContestDetail />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
