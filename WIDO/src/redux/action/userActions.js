import Axios from "axios"
import { api_url } from "../../helpers/api_url"

export const addData = (data) => {
    return (dispatch) => {
        Axios.post(`${api_url}/data`, data)
        .then((res) => {
            console.log('masuk')
            dispatch({
                type: 'ADD_DATA'
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }
}