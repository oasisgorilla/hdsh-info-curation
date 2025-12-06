import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import WeeklyReportPage from './pages/WeeklyReportPage';
import NewsDetailPage from './pages/NewsDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/weekly-report" element={<WeeklyReportPage />} />
        <Route path="/news/:newsId" element={<NewsDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
