import axios from 'axios'

const baseUrl_test = 'https://kubsau-testbackend.melod1n.dedyn.io';
const baseUrl = 'https://kubsau-backend.melod1n.dedyn.io';


axios.interceptors.request.use(async request => {
    request.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return request
})

async function loginAxios(loginInfo, callback) {
   const url = `${baseUrl}/auth`

    console.log(url)

    await axios.get(url, {
        params: {
            login: loginInfo.email,
            password: loginInfo.password
        }
    }).then((res) => {
        callback(res.data)
    })
}

async function checkAccount(callback) {
    const url = `${baseUrl}/account`;

    await axios.get(url).then((res) => {
        callback(res.data)
    })
    
   
}

async function getDataFilters(callback) {
    const url = `${baseUrl}/journals/filters`;

    await axios.get(url).then((res) => {
        callback(res.data)
        console.log(res.data);
    })
}

async function getDataAdminJournal(parameter, callback) {
    const url = `${baseUrl}/journals`;

    await axios.get(url, {
        params: {

            disciplineId: parameter.disciplineId,
            teacherId: parameter.teacherId,
            departmentId: parameter.departmentId,
            groupId: parameter.groupId,
            workTypeId: parameter.workTypeId

        },
    }).then((res) => {
        callback(res.data)
        console.log(res.data);
    })
}

async function getDataForQR(callback){
    const url = `${baseUrl}/qr`;

    await axios.get(url).then((res)=>{
        callback(res.data);
    })

}

// async function getDisciplines(){
//     fetch(`${baseUrl}/disciplines`).then((response) =>{
//         return response.json();
//     })
// }



async function getDisciplines(callback){
    const url = `${baseUrl_test}/disciplines`;

    await axios.get(url).then((res) =>{
        callback(res.data);
    })
}

function getTextError(data){
    let textError = '';
    switch (data.code) {
        case 101:
            textError = 'Неверные учетные данные!';
            break;
        case 102:
            textError = 'Требуется токен доступа!';
            break;
        case 103:
            textError = 'Сессия истекла!';
            break;
        
        default:
            textError = 'Неизвестная ошибка!';
    }
    return textError;
}

export {
    checkAccount, getDataFilters, loginAxios, getDataAdminJournal, getTextError, getDataForQR, getDisciplines
}

