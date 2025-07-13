import axios from 'axios'

const axiosInstance = axios.create({
    baseURL : `https://news-daily-server.vercel.app`
})

const useAxios = () => {
  return axiosInstance;
}

export default useAxios