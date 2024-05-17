import axios from 'axios'

const baseUrl_test = 'https://kubsau-testbackend.melod1n.dedyn.io';
const baseUrl = 'https://kubsau-backend.melod1n.dedyn.io';


axios.interceptors.request.use(async request => {
    request.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return request
})

async function loginAxios(loginInfo, callback) {
    const url = `${baseUrl_test}/auth`

    // console.log(loginInfo)

    await axios.post(url, {
        login: loginInfo.email,
        password: loginInfo.password

    }, {
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
        callback(res.data);
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
        params: {
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

async function searchOfWorks(offset, limit, str, callback){
    const url = `${baseUrl_test}/works/latest/search`;

    await axios.get(url, {
        params:{
            offset: offset,
            limit: limit,
            query: str
        }
    }).then((res) => {
        callback(res.data);
    }).catch((error) => {
        console.log(error)
    })
}

async function getDataPrograms(offset, limit, callback) {
    const url = `${baseUrl_test}/programs`;

    await axios.get(url, {
        params: {
            offset: offset,
            limit: limit,
            extended: true
        }
    }).then((res) => {
        callback(res.data);
    }).catch((error) => {
        console.log(error)
    })
}

async function getDirectivitiesPrograms(callback) {
    const url = `${baseUrl_test}/directivities`;

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

async function addNewDepartment(dapartmentTitle, departmentPhone, callback) {
    const url = `${baseUrl_test}/departments`;
    await axios.post(url, {
        title: dapartmentTitle,
        phone: departmentPhone
    }, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }).then((res) => {
        console.log(res);
        callback(res.data);
    }).catch((error) => {
        console.log(error)
    })
}

async function editDepartment(id, dapartmentTitle, departmentPhone, callback) {
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
        callback(res.data);
    }).catch((error) => {
        console.log(error)
    })
}

async function deleteDepartment(index, callback) {
    const url = `${baseUrl_test}/departments/${index}`;
    await axios.delete(url).then((res) => {
        console.log(res);
        callback(res.data);
    }).catch((error) => {
        console.log(error)
    })
}

async function getAllGroups(callback) {
    const url = `${baseUrl_test}/groups`;

    await axios.get(url).then((res) => {
        callback(res.data);
    }).catch((error) => {
        console.log(error)
    })

}

async function getAllDirectivities(ext, callback) {
    const url = `${baseUrl_test}/directivities`;

    await axios.get(url,{
        params:{
            extended: ext
        }
    }).then((res) => {
        callback(res.data);
    }).catch((error) => {
        console.log(error)
    })

}

async function getAllHeads(callback) {
    const url = `${baseUrl_test}/heads`;

    await axios.get(url).then((res) => {
        callback(res.data);
    }).catch((error) => {
        console.log(error)
    })

}

async function addNewGroup(gropTitle, directId, callback) {
    const url = `${baseUrl_test}/groups`;
    await axios.post(url, {
        title: gropTitle,
        directivityId: directId
    }, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }).then((res) => {
        console.log(res);
        callback(res.data);
    }).catch((error) => {
        console.log(error)
    })
}

async function editGroup(id, groupAbb, groupNumber, groupDirectivity, callback) {
    const url = `${baseUrl_test}/groups/${id}`;
    // console.log(id, dapartmentTitle, departmentPhone)
    await axios.patch(url, {
        title: groupAbb+groupNumber,
        directivityId: groupDirectivity
    }, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }
    ).then((res) => {
        console.log(res);
        callback(res.data);
    }).catch((error) => {
        console.log(error)
    })
}
async function deleteGroup(index, callback) {
    const url = `${baseUrl_test}/groups/${index}`;
    await axios.delete(url).then((res) => {
        console.log(res);
        callback(res.data);
    }).catch((error) => {
        console.log(error)
    })
}

async function getAllStudents(off, lim, callback) {
    const url = `${baseUrl_test}/students?extended=true`;

    await axios.get(url, {
        params:{
            offset: off,
            limit: lim
        }
    }).then((res) => {
        callback(res.data);
    }).catch((error) => {
        console.log(error)
    })

}

async function searchOfStudents(offset, limit, str, callback){
    const url = `${baseUrl_test}/students/search`;

    await axios.get(url, {
        params:{
            offset: offset,
            limit: limit,
            query: str
        }
    }).then((res) => {
        callback(res.data);
    }).catch((error) => {
        console.log(error)
    })
}

async function addNewStudent(firstN, lastN, middleN, group, status, callback) {
    const url = `${baseUrl_test}/students`;
    await axios.post(url, {
        firstName: firstN,
        lastName: lastN,
        middleName: middleN,
        groupId: group,
        statusId: status
    }, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }).then((res) => {
        console.log(res);
        callback(res.data);
    }).catch((error) => {
        console.log(error)
    })
}

async function editStudent(id, firstN, lastN, middleN, group, status, callback) {
    const url = `${baseUrl_test}/students/${id}`;
    await axios.patch(url, {
        firstName: firstN,
        lastName: lastN,
        middleName: middleN,
        groupId: group,
        statusId: status
    }, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }).then((res) => {
        console.log(res);
        callback(res.data);
    }).catch((error) => {
        console.log(error)
    })
}

async function deleteStudent(index, callback) {
    const url = `${baseUrl_test}/students/${index}`;
    await axios.delete(url).then((res) => {
        console.log(res);
        callback(res.data);
    }).catch((error) => {
        console.log(error)
    })
}

async function getAllEmployees(callback) {
    const url = `${baseUrl_test}/employees`;

    await axios.get(url).then((res) => {
        callback(res.data);
    }).catch((error) => {
        console.log(error)
    })}




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
    getAllWorkTypes, getAllDepartments, addNewDepartment, deleteDepartment, editDepartment, getDataPrograms, getDirectivitiesPrograms,
    getAllGroups, getAllDirectivities, getAllHeads, addNewGroup, editGroup, deleteGroup, addNewStudent, editStudent, deleteStudent,
    searchOfWorks, searchOfStudents, getAllEmployees
}

