import axios from 'axios'

const baseUrl = 'https://testbackend.melod1n.dedyn.io';

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

async function checkAccount() {
    const url = `${baseUrl}/account`;
    console.log(url)
    const res = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    })

    return res.json()
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


export {
    checkAccount, getDataFilters, loginAxios, getDataAdminJournal
}

