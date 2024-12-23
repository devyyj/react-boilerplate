import React, {useEffect, useState} from 'react';
import axios from '../api/axios.js';

const Admin = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/admin');
        setData(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.message : 'API 호출 실패');
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Admin Page</h1>
      {error ? (
        <p style={{color: 'red'}}>Error: {error}</p>
      ) : data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Admin;
