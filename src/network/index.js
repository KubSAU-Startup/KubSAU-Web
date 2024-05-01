import axios from 'axios'

const baseUrl_test = 'https://kubsau-testbackend.melod1n.dedyn.io';
const baseUrl = 'https://kubsau-backend.melod1n.dedyn.io';


axios.interceptors.request.use(async request => {
    request.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return request
})

async function loginAxios(loginInfo, callback) {
    const url = `${baseUrl_test}/auth`

    console.log(loginInfo)

    await axios.post(url, {
            login: loginInfo.email,
            password: loginInfo.password
        
    },{
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }).then((res) => {
        callback(res.data);
    }).catch((error) => {
        console.log(error)
    })
}

async function checkAccount(callback) {
    const url = `${baseUrl_test}/account`;

    await axios.get(url).then((res) => {
        callback(res.data)
    }).catch((error) => {
        console.log(error)
    })


}

async function getFilterWorkType(callback) {
    const url = `${baseUrl_test}/works/latest/filters/worktypes`;

    await axios.get(url).then((res) => {
        callback(res.data);
    }).catch((error) => {
        console.log(error)
    })
}
async function getFilterDiscipline(callback) {
    const url = `${baseUrl_test}/works/latest/filters/disciplines`;

    await axios.get(url).then((res) => {
        callback(res.data);
    }).catch((error) => {
        console.log(error)
    })
}
async function getFilterEmployees(callback) {
    const url = `${baseUrl_test}/works/latest/filters/employees`;

    await axios.get(url).then((res) => {
        callback(res.data);
    }).catch((error) => {
        console.log(error)
    })
}
async function getFilterGroups(callback) {
    const url = `${baseUrl_test}/works/latest/filters/groups`;

    await axios.get(url).then((res) => {
        callback(res.data);
    }).catch((error) => {
        console.log(error)
    })
}
async function getFilterDepartments(callback) {
    const url = `${baseUrl_test}/works/latest/filters/departments`;

    await axios.get(url).then((res) => {
        callback(res.data);
    }).catch((error) => {
        console.log(error)
    })
}

async function getDataAdminJournal(offset, limit, par, callback) {
    const url = `${baseUrl_test}/works/latest`;

    await axios.get(url, {
        params:{
            offset: offset,
            limit: limit,
            workTypeId: par.workTypeId,
            disciplineId: par.disciplineId,
            employeeId: par.teacherId,
            departmentId: par.departmentId,
            groupId: par.groupId
        }
    }).then((res) => {
        callback(res.data);
    }).catch((error) => {
        console.log(error)
    })
}

async function getAllStudents(callback) {
    const url = `${baseUrl_test}/students`;

    await axios.get(url).then((res) => {
        callback(res.data);
    }).catch((error) => {
        console.log(error)
    })

}

async function getAllDepartments(callback) {
    const url = `${baseUrl_test}/departments`;

    await axios.get(url).then((res) => {
        callback(res.data);
    }).catch((error) => {
        console.log(error)
    })

}

async function getDataForQR(callback) {
    const url = `${baseUrl_test}/programs`;

    await axios.get(url).then((res) => {
        callback(res.data);
    }).catch((error) => {
        console.log(error)
    })

}

// async function getDisciplinesByPrograms(progId, callback) {
//     const url = `${baseUrl_test}/qr/programs/disciplines`;
//     await axios.get(url, {
//         params: {
//             programIds: progId,
//             extended: true
//         }
//     }).then((res) => {
//         callback(res.data);
//     })
// }

async function getDisciplinesForPrograms(callback) {
    const url = `${baseUrl_test}/qr/programs/disciplines`;

    await axios.get(url, {
        params: {
            extended: true
        }
    }).then((res) => {
        callback(res.data);
    }).catch((error) => {
        console.log(error)
    })
}

async function getGroups(callback) {
    const url = `${baseUrl_test}/qr/groups`;

    await axios.get(url).then((res) => {
        callback(res.data);
    }).catch((error) => {
        console.log(error)
    })
}

async function getStudents(groupId, callback) {
    const url = `${baseUrl_test}/qr/groups/${groupId}/students`;

    await axios.get(url).then((res) => {
        callback(res.data);
    }).catch((error) => {
        console.log(error)
    })
}

async function getAllDisciplines(callback) {
    const url = `${baseUrl_test}/disciplines`;

    await axios.get(url).then((res) => {
        callback(res.data);
    }).catch((error) => {
        console.log(error)
    })
}

async function getAllWorkTypes(callback) {
    const url = `${baseUrl_test}/worktypes`;

    await axios.get(url).then((res) => {
        callback(res.data);
    }).catch((error) => {
        console.log(error)
    })
}

async function addNewDepartment(dapartmentTitle, departmentPhone) {
    const url = `${baseUrl_test}/departments`;
    await axios.post(url, {
        title: dapartmentTitle,
        phone: departmentPhone
    }, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }).then((res) => {
        console.log(res);
        return res;
    }).catch((error) => {
        console.log(error)
    })
}

async function editDepartment(id, dapartmentTitle, departmentPhone) {
    const url = `${baseUrl_test}/departments/${id}`;
    console.log(id, dapartmentTitle, departmentPhone)
    await axios.patch(url, {
        title: dapartmentTitle,
        phone: departmentPhone
    }, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }
    ).then((res) => {
        console.log(res);
        return res;
    }).catch((error) => {
        console.log(error)
    })
}

async function deleteDepartment(index) {
    const url = `${baseUrl_test}/departments/${index}`;
    await axios.delete(url).then((res) => {
        console.log(res);
        return res;
    }).catch((error) => {
        console.log(error)
    })
}

function getTextError(data) {
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
    checkAccount, getFilterWorkType, getFilterDiscipline, getFilterEmployees, getFilterGroups, getFilterDepartments, loginAxios, getDataAdminJournal, 
    getAllStudents, getTextError, getDataForQR, getDisciplinesForPrograms, getGroups, getStudents, getAllDisciplines,
    getAllWorkTypes, getAllDepartments, addNewDepartment, deleteDepartment, editDepartment
}

