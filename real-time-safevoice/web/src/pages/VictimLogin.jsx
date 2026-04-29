import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function VictimLogin() {
  const [caseId, setCaseId] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/victim-login', { caseId, accessCode });
      localStorage.setItem('victimCaseId', caseId);
      localStorage.setItem('victimAccessCode', accessCode);
      navigate(`/victim/case/${caseId}`);
    } catch (err) {
      setError('Invalid Case ID or Access Code');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">Victim Login</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Case ID (e.g., C123456)" className="w-full border p-2 mb-3 rounded" value={caseId} onChange={e => setCaseId(e.target.value)} required />
          <input type="text" placeholder="Access Code" className="w-full border p-2 mb-3 rounded" value={accessCode} onChange={e => setAccessCode(e.target.value)} required />
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">Access My Case</button>
        </form>
        <div className="mt-4 text-center">
          <button id="forgotBtn" className="text-blue-600 text-sm" onClick={() => alert('Forgot details? Contact SCOEN admin.')}>Forgot Case ID / Access Code?</button>
        </div>
      </div>
    </div>
  );
}