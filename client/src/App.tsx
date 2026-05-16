import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Vocabulary from './pages/Vocabulary';
import Reading from './pages/Reading';
import Translation from './pages/Translation';
import Writing from './pages/Writing';
import Listening from './pages/Listening';
import Exam from './pages/Exam';
import Strategy from './pages/Strategy';

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="strategy" element={<Strategy />} />
        <Route path="vocabulary" element={<Vocabulary />} />
        <Route path="reading" element={<Reading />} />
        <Route path="translation" element={<Translation />} />
        <Route path="writing" element={<Writing />} />
        <Route path="listening" element={<Listening />} />
        <Route path="exam" element={<Exam />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
