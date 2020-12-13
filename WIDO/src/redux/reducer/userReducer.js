const INITIAL_STATE = {
    id: 0,
    nama: '',
    usia: '',
    pekerjaan: '',
}

export const userReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case 'ADD_DATA':
            return {
                ...state,
                id: action.payload.id,
                nama: action.payload.nama,
                usia: action.payload.user,
                pekerjaan: action.payload.pekerjaan
            }
        default:
            return state

    }
}