import PatientDashboard from '../components/PatientDashboard'
import DoctorDashboard from '../components/DoctorDashboard'
import useSWR from "swr";


export default function Home() {
  const { data } = useSWR('/api/user/current');
  return data?.type === 'doctor' ? <DoctorDashboard/> : <PatientDashboard/>;
}