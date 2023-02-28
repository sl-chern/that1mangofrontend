import { useDispatch } from "react-redux"
import { change, changeId, changeIsStaff, changeEmail, changeUser } from "../components/Login/loginSlice"

const useLogout = () => {
  const dispatch = useDispatch()

  localStorage.removeItem("access")
  localStorage.removeItem("refresh")

  dispatch(change(""))
  dispatch(changeId(null))
  dispatch(changeIsStaff(false))
  dispatch(changeEmail(""))
  dispatch(changeUser(null))

  return null
}

export default useLogout