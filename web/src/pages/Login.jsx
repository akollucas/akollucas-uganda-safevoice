import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(username, password, role);
      if (res.user.role === 'admin') navigate('/admin');
      else if (res.user.role === 'policeAdmin') navigate('/police-admin');
      else if (res.user.role === 'policeOfficer') navigate('/officer');
      else if (res.user.role === 'volunteer') navigate('/volunteer');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">Staff Login</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" className="w-full border p-2 mb-3 rounded" value={username} onChange={e => setUsername(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full border p-2 mb-3 rounded" value={password} onChange={e => setPassword(e.target.value)} required />
          <select className="w-full border p-2 mb-3 rounded" value={role} onChange={e => setRole(e.target.value)}>
            <option value="admin">SCOEN Admin</option>
            <option value="policeAdmin">Police Admin</option>
            <option value="policeOfficer">Police Officer</option>
            <option value="volunteer">CPV Volunteer</option>
          </select>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
        </form>
        <div className="mt-4 text-center">
          <a href="/victim-login" className="text-blue-600 text-sm">Victim? Login with Case ID & Access Code</a>
        </div>
      </div>
    </div>
  );
}