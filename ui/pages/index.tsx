import PatientDashboard from '../components/patientDashboard'
import DoctorDashboard from '../components/doctorDashboard'
import useSWR from "swr";


export default function Home() {
  const { data } = useSWR('/api/user/current');
  return data?.type === 'doctor' ? <DoctorDashboard/> : <PatientDashboard/>;
}