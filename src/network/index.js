import axios from 'axios'

const baseUrl_test = 'https://kubsau-testbackend.melod1n.dedyn.io';
const baseUrl = 'https://kubsau-backend.melod1n.dedyn.io';


axios.interceptors.request.use(async request => {
    request.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return request
})

async function loginAxios(loginInfo, callback) {
    const url = `${baseUrl_test}/auth`

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
    const url = `${baseUrl_test}/account`;

    await axios.get(url).then((res) => {
        callback(res.data);
    })
}

async function getFilterWorkType(callback) {
    const url = `${baseUrl_test}/works/latest/filters/worktypes`;

    await axios.get(url).then((res) => {
        callback(res.data);
    })
}

async function getFilterDiscipline(callback) {
    const url = `${baseUrl_test}/works/latest/filters/disciplines`;

    await axios.get(url).then((res) => {
        callback(res.data);
    })
}

async function getFilterEmployees(callback) {
    const url = `${baseUrl_test}/works/latest/filters/employees`;

    await axios.get(url).then((res) => {
        callback(res.data);
    })
}

async function getFilterGroups(callback) {
    const url = `${baseUrl_test}/works/latest/filters/groups`;

    await axios.get(url).then((res) => {
        callback(res.data);
    })
}

async function getFilterDepartments(callback) {
    const url = `${baseUrl_test}/works/latest/filters/departments`;

    await axios.get(url).then((res) => {
        callback(res.data);
    })
}

async function getDataAdminJournal(offset, limit, par, query, callback) {
    const url = `${baseUrl_test}/works/latest`;

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
    const url = `${baseUrl_test}/works/${id}`;
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
    const url = `${baseUrl_test}/works/${index}`;
    await axios.delete(url).then((res) => {
        callback(res.data);
    })
}

async function getDataPrograms(offset, limit, param, text, callback) {
    const url = `${baseUrl_test}/programs/search`;

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
    const url = `${baseUrl_test}/programs/${id}/disciplines`;
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
    const url = `${baseUrl_test}/directivities`;

    await axios.get(url).then((res) => {
        callback(res.data);
    })
}

async function getAllDepartments(callback) {
    const url = `${baseUrl_test}/departments`;

    await axios.get(url).then((res) => {
        callback(res.data);
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
        callback(res.data);
    })
}

async function editDepartment(id, dapartmentTitle, departmentPhone, callback) {
    const url = `${baseUrl_test}/departments/${id}`;
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
    const url = `${baseUrl_test}/departments/${index}`;
    await axios.delete(url).then((res) => {
        callback(res.data);
    })
}

async function getAllGroups(callback) {
    const url = `${baseUrl_test}/groups`;

    await axios.get(url).then((res) => {
        callback(res.data);
    })

}

async function getAllDirectivities(ext, callback) {
    const url = `${baseUrl_test}/directivities`;

    await axios.get(url, {
        params: {
            extended: ext
        }
    }).then((res) => {
        callback(res.data);
    })

}

async function getAllHeads(callback) {
    const url = `${baseUrl_test}/heads`;

    await axios.get(url).then((res) => {
        callback(res.data);
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
        callback(res.data);
    })
}

async function editGroup(id, groupAbb, groupNumber, groupDirectivity, callback) {
    const url = `${baseUrl_test}/groups/${id}`;
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
    const url = `${baseUrl_test}/groups/${index}`;
    await axios.delete(url).then((res) => {
        callback(res.data);
    })
}

async function getAllStudents(off, lim, callback) {
    const url = `${baseUrl_test}/students?extended=true`;

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
    const url = `${baseUrl_test}/students/search`;

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
        callback(res.data);
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
        callback(res.data);
    })
}

async function deleteStudent(index, callback) {
    const url = `${baseUrl_test}/students/${index}`;
    await axios.delete(url).then((res) => {
        callback(res.data);
    })
}

async function getAllEmployees(callback) {
    const url = `${baseUrl_test}/employees`;

    await axios.get(url).then((res) => {
        callback(res.data);
    })
}
async function addNewEmployee(firstN, lastN, middleN, email, typeUser, callback) {
    const url = `${baseUrl_test}/employees`;
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
    const url = `${baseUrl_test}/employees/${id}`;
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
    const url = `${baseUrl_test}/employees/${index}`;
    await axios.delete(url).then((res) => {
        callback(res.data);
    })
}

async function getStudentsByGroups(param, callback) {
    const url = `${baseUrl_test}/qr/groups/students`;

    await axios.get(url, {
        params: {
            groupIds: param
        }
    }).then((res) => {
        callback(res.data);
    })
}



async function getDataForQR(callback) {
    const url = `${baseUrl_test}/programs`;

    await axios.get(url).then((res) => {
        callback(res.data);
    })

}

async function getAllDisciplines(callback) {
    const url = `${baseUrl_test}/disciplines`;

    await axios.get(url).then((res) => {
        callback(res.data);
    })
}

async function getAllWorkTypes(callback) {
    const url = `${baseUrl_test}/worktypes`;

    await axios.get(url).then((res) => {
        callback(res.data);
    })
}

async function generateQrCodes(id, groups, callback) {
    const url = `${baseUrl_test}/programs/${id}/qr`;

    await axios.get(url, {
        params: {
            groupIds: groups
        },
        responseType: 'arraybuffer'
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

        default:
            textError = 'Неизвестная ошибка!';
    }
    return textError;
}

export {
    checkAccount, getFilterWorkType, getFilterDiscipline, getFilterEmployees, getFilterGroups, getFilterDepartments, loginAxios, getDataAdminJournal,
    getAllStudents, getTextError, getDataForQR, 
    // getDisciplinesForPrograms, getGroups, getStudents, 
    getAllDisciplines,
    getAllWorkTypes, generateQrCodes,
    getAllDepartments, addNewDepartment, deleteDepartment, editDepartment, getDataPrograms, getDirectivitiesPrograms,
    getAllGroups, getAllDirectivities, getAllHeads, addNewGroup, editGroup, deleteGroup, addNewStudent, editStudent, deleteStudent,
    searchOfStudents, getAllEmployees, getStudentsByGroups, addNewEmployee, editEmployee, deleteEmployee, editWork, editDisciplines, deleteWork
}

