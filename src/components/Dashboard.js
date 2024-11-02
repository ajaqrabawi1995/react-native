// // components/Dashboard.js
// import { useEffect, useState } from 'react';
// import axios from 'axios';

// const Dashboard = () => {
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem('token');
//       const { data } = await axios.get('http://localhost:5000/api/superadmin/dashboard', {
//         headers: { Authorization: token },
//       });
//       setData(data);
//     };
//     fetchData();
//   }, []);

//   return <div>{data ? <h1>Welcome to the Admin Dashboard</h1> : <p>Loading...</p>}</div>;
// };

// export default Dashboard;
