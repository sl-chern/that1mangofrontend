import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access')
    if (token) 
      config.headers["Authorization"] = `JWT ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if(localStorage.getItem('refresh') === null)
      return Promise.reject(err)
    
    if (err.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true
      try {
        const rs = await axios.post("/users/token/refresh/", {
          refresh: localStorage.getItem('refresh'),
        });
        const { access, refresh } = rs.data
        localStorage.setItem('access', access)
        localStorage.setItem('refresh', refresh)
        return instance(originalConfig)
      } 
      catch (_error) {
        return Promise.reject(_error)
      }
    }

    return Promise.reject(err)
  }
)

export default instance;