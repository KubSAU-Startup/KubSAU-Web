import axios from 'axios'

// const localStorage.getItem('url') = 'https://kubsau-testbackend.melod1n.dedyn.io';
// let localStorage.getItem('url') = localStorage.getItem('url');

const baseUrl = 'https://kubsau-backend.melod1n.dedyn.io';


axios.interceptors.request.use(async request => {
    request.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return request
})

async function loginAxios(loginInfo, callback) {
    const url = `${localStorage.getItem('url')}/auth`

    await axios.post(url, {
        login: loginInfo.email,
        password: loginInfo.password

    }, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }).then((res) => {
        callback(res.data);
    })
}

async function checkAccount(callback) {
    const url = `${localStorage.getItem('url')}/account`;

    await axios.get(url).then((res) => {
        callback(res.data);
    })
}


async function checkUrl(callback) {
    const url = `${localStorage.getItem('url')}`;

    await axios.get(url).then((res) => {
        callback(res.data);
    })
}

async function getFilterWorkType(callback) {
    const url = `${localStorage.getItem('url')}/works/latest/filters/worktypes`;

    await axios.get(url).then((res) => {
        callback(res.data);
    })
}

async function getFilterDiscipline(callback) {
    const url = `${localStorage.getItem('url')}/works/latest/filters/disciplines`;

    await axios.get(url).then((res) => {
        callback(res.data);
    })
}

async function getFilterEmployees(callback) {
    const url = `${localStorage.getItem('url')}/works/latest/filters/employees`;

    await axios.get(url).then((res) => {
        callback(res.data);
    })
}

async function getFilterGroups(callback) {
    const url = `${localStorage.getItem('url')}/works/latest/filters/groups`;

    await axios.get(url).then((res) => {
        callback(res.data);
    })
}

async function getFilterDepartments(callback) {
    const url = `${localStorage.getItem('url')}/works/latest/filters/departments`;

    await axios.get(url).then((res) => {
        callback(res.data);
    })
}

async function getDataAdminJournal(offset, limit, par, query, callback) {
    const url = `${localStorage.getItem('url')}/works/latest`;

    await axios.get(url, {
        params: {
            offset: offset,
            limit: limit,
            workTypeId: par.workTypeId,
            disciplineId: par.disciplineId,
            employeeId: par.teacherId,
            departmentId: par.departmentId,
            groupId: par.groupId,
            query: query
        }
    }).then((res) => {
        callback(res.data);
    })
}

async function editWork(id, date, title, callback) {
    const url = `${localStorage.getItem('url')}/works/${id}`;
    await axios.patch(url, {
        registrationDate: date,
        title: title
    }, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }).then((res) => {
        callback(res.data);
    })
}

async function deleteWork(index, callback) {
    const url = `${localStorage.getItem('url')}/works/${index}`;
    await axios.delete(url).then((res) => {
        callback(res.data);
    })
}

async function getDataPrograms(offset, limit, param, text, callback) {
    const url = `${localStorage.getItem('url')}/programs/search`;

    await axios.get(url, {
        params: {
            offset: offset,
            limit: limit,
            query: text,
            semester: param.semester,
            directivityId: param.directivity
        }
    }).then((res) => {
        callback(res.data);
    })

}

async function editDisciplines(id, disciplineIds, workTypeIds, callback) {
    const url = `${localStorage.getItem('url')}/programs/${id}/disciplines`;
    await axios.patch(url, {
        disciplineIds: disciplineIds,
        workTypeIds: workTypeIds
    }, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }).then((res) => {
        callback(res.data);
    })
}

async function getDirectivitiesPrograms(callback) {
    const url = `${localStorage.getItem('url')}/directivities`;

    await axios.get(url).then((res) => {
        callback(res.data);
    })
}

async function getAllDepartments(callback) {
    const url = `${localStorage.getItem('url')}/departments`;

    await axios.get(url).then((res) => {
        callback(res.data);
    })

}

async function addNewDepartment(dapartmentTitle, departmentPhone, callback) {
    const url = `${localStorage.getItem('url')}/departments`;
    await axios.post(url, {
        title: dapartmentTitle,
        phone: departmentPhone
    }, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }).then((res) => {
        callback(res.data);
    })
}

async function editDepartment(id, dapartmentTitle, departmentPhone, callback) {
    const url = `${localStorage.getItem('url')}/departments/${id}`;
    await axios.patch(url, {
        title: dapartmentTitle,
        phone: departmentPhone
    }, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }
    ).then((res) => {
        callback(res.data);
    })
}

async function deleteDepartment(index, callback) {
    const url = `${localStorage.getItem('url')}/departments/${index}`;
    await axios.delete(url).then((res) => {
        callback(res.data);
    })
}

async function getAllGroups(callback) {
    const url = `${localStorage.getItem('url')}/groups`;

    await axios.get(url).then((res) => {
        callback(res.data);
    })

}

async function getAllDirectivities(ext, callback) {
    const url = `${localStorage.getItem('url')}/directivities`;

    await axios.get(url, {
        params: {
            extended: ext
        }
    }).then((res) => {
        callback(res.data);
    })

}

async function getAllHeads(callback) {
    const url = `${localStorage.getItem('url')}/heads`;

    await axios.get(url).then((res) => {
        callback(res.data);
    })

}

async function addNewGroup(gropTitle, directId, callback) {
    const url = `${localStorage.getItem('url')}/groups`;
    await axios.post(url, {
        title: gropTitle,
        directivityId: directId
    }, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }).then((res) => {
        callback(res.data);
    })
}

async function editGroup(id, groupAbb, groupNumber, groupDirectivity, callback) {
    const url = `${localStorage.getItem('url')}/groups/${id}`;
    await axios.patch(url, {
        title: groupAbb + groupNumber,
        directivityId: groupDirectivity
    }, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }
    ).then((res) => {
        callback(res.data);
    })
}
async function deleteGroup(index, callback) {
    const url = `${localStorage.getItem('url')}/groups/${index}`;
    await axios.delete(url).then((res) => {
        callback(res.data);
    })
}

async function getAllStudents(off, lim, callback) {
    const url = `${localStorage.getItem('url')}/students?extended=true`;

    await axios.get(url, {
        params: {
            offset: off,
            limit: lim
        }
    }).then((res) => {
        callback(res.data);
    })

}

async function searchOfStudents(offset, limit, param, query, callback) {
    const url = `${localStorage.getItem('url')}/students/search`;

    await axios.get(url, {
        params: {
            offset: offset,
            limit: limit,
            groupId: param.groupId,
            gradeId: param.gradeId,
            statusId: param.statusId,
            query: query
        }
    }).then((res) => {
        callback(res.data);
    })
}

async function addNewStudent(firstN, lastN, middleN, group, status, callback) {
    const url = `${localStorage.getItem('url')}/students`;
    await axios.post(url, {
        firstName: firstN,
        lastName: lastN,
        middleName: middleN,
        groupId: group,
        statusId: status
    }, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }).then((res) => {
        callback(res.data);
    })
}

async function editStudent(id, firstN, lastN, middleN, group, status, callback) {
    const url = `${localStorage.getItem('url')}/students/${id}`;
    await axios.patch(url, {
        firstName: firstN,
        lastName: lastN,
        middleName: middleN,
        groupId: group,
        statusId: status
    }, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }).then((res) => {
        callback(res.data);
    })
}

async function deleteStudent(index, callback) {
    const url = `${localStorage.getItem('url')}/students/${index}`;
    await axios.delete(url).then((res) => {
        callback(res.data);
    })
}

async function getAllEmployees(callback) {
    const url = `${localStorage.getItem('url')}/employees`;

    await axios.get(url).then((res) => {
        callback(res.data);
    })
}
async function addNewEmployee(firstN, lastN, middleN, email, typeUser, callback) {
    const url = `${localStorage.getItem('url')}/employees`;
    await axios.post(url, {
        firstName: firstN,
        lastName: lastN,
        middleName: middleN,
        email: email,
        type: typeUser
    }, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }).then((res) => {
        callback(res.data);
    })
}

async function editEmployee(id, firstN, lastN, middleN, email, typeUser, callback) {
    const url = `${localStorage.getItem('url')}/employees/${id}`;
    await axios.patch(url, {
        firstName: firstN,
        lastName: lastN,
        middleName: middleN,
        email: email,
        type: typeUser
    }, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }).then((res) => {
        callback(res.data);
    })
}
async function deleteEmployee(index, callback) {
    const url = `${localStorage.getItem('url')}/employees/${index}`;
    await axios.delete(url).then((res) => {
        callback(res.data);
    })
}

async function getStudentsByGroups(param, callback) {
    const url = `${localStorage.getItem('url')}/qr/groups/students`;

    await axios.get(url, {
        params: {
            groupIds: param
        }
    }).then((res) => {
        callback(res.data);
    })
}



async function getDataForQR(callback) {
    const url = `${localStorage.getItem('url')}/programs`;

    await axios.get(url).then((res) => {
        callback(res.data);
    })

}

async function getAllDisciplines(callback) {
    const url = `${localStorage.getItem('url')}/disciplines`;

    await axios.get(url).then((res) => {
        callback(res.data);
    })
}

async function getAllWorkTypes(callback) {
    const url = `${localStorage.getItem('url')}/worktypes`;

    await axios.get(url).then((res) => {
        callback(res.data);
    })
}

async function generateQrCodes(id, groups, callback) {
    const url = `${localStorage.getItem('url')}/programs/${id}/qr`;

    await axios.get(url, {
        params: {
            groupIds: groups
        },
        responseType: 'arraybuffer'
    }).then((res) => {
        callback(res.data);
    })
}

async function modifySession(depId, callback) {
    const url = `${localStorage.getItem('url')}/auth`;

    await axios.patch(url, {
        headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
    },{
        params: {
            departmentId: depId
        }
    }).then((res) => {
        callback(res.data);
    })
}
async function getEmployeeById(id, callback) {
    const url = `${localStorage.getItem('url')}/employees/${id}`;

    await axios.get(url).then((res) => {
        callback(res.data);
    })
}

async function updatePassword(oldPass, newPass, callback) {
    const url = `${localStorage.getItem('url')}/account`

    await axios.patch(url, {
        currentPassword: oldPass,
        newPassword: newPass

    }, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }).then((res) => {
        callback(res.data);
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
        case 105:
            textError = 'Недоступная кафедра';
            break;

        default:
            textError = 'Неизвестная ошибка!';
    }
    return textError;
}

export {
    checkAccount, getFilterWorkType, getFilterDiscipline, getFilterEmployees,
    getFilterGroups, getFilterDepartments, loginAxios, getDataAdminJournal,
    getAllStudents, getTextError, getDataForQR, getAllDisciplines,
    getAllWorkTypes, generateQrCodes, getAllDepartments, addNewDepartment,
    deleteDepartment, editDepartment, getDataPrograms, getDirectivitiesPrograms,
    getAllGroups, getAllDirectivities, getAllHeads, addNewGroup, editGroup, deleteGroup,
    addNewStudent, editStudent, deleteStudent, searchOfStudents, getAllEmployees,
    getStudentsByGroups, addNewEmployee, editEmployee, deleteEmployee, editWork, editDisciplines,
    deleteWork, modifySession, getEmployeeById, checkUrl, updatePassword
}

