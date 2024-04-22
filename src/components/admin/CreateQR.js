import React, { useEffect, useState } from 'react';
import './Admin_header.css';
import './CreateQR.css'
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Select from 'react-select';
import QRCode from 'qrcode';
import JSZip, { filter, forEach } from "jszip";
import Modal from '../Modal/Modal';
import { faFilter, faUndo, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loading from '../Modal/Loading';
import { getDataForQR, getTextError, getDisciplinesForPrograms, getGroups, getStudents, getAllDisciplines, getAllWorkTypes } from '../../network';
import Error_modal from '../Modal/Error_modal';
import { saveAs } from 'file-saver';
import { customStyles, customStylesModal, customStylesQR, customStylesTypeOfWork } from '../Select_style/Select_style';
import Empty_modal from '../Modal/Empty_modal';

function CreateQR() {
  const [isOpen, setOpen] = useState(false);
  const [emptyModalActive, setEmptyModalActive] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [userStates, setUserStates] = useState({});

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const [addActive, setAddActive] = useState(false);
  const [editActive, setEditActive] = useState(false);
  const [dataDisciplines, setDataDisciplines] = useState({
    response: [],
    error: null,
    success: true
  });

  const [allDisciplines, setAllDisciplines] = useState({
    response: [],
    error: null,
    success: true
  });

  const [allWorkTypes, setAllWorkTypes] = useState({
    response: [],
    error: null,
    success: true
  });

  const [programQR, setProgramQR] = useState({
    response: [],
    error: null,
    success: true
  });

  const [groupQR, setGroupQR] = useState({
    response: [],
    error: null,
    success: true
  });

  const [studQR, setStudQR] = useState({
    response: [],
    error: null,
    success: true
  });

  const [workTypes, setWorkTypes] = useState({});
  const [editWorkTypes, setEditWorkTypes] = useState({});

  const [errorActive, setErrorActive] = useState(false);
  const [textError, setTextError] = useState('');

  const [semester, setSemester] = useState(-1);
  const [program, setProgram] = useState(null);
  const [group, setGroup] = useState(null);

  const [semesterFilter, setSemesterFilter] = useState(-1);
  const [programFilter, setProgramFilter] = useState(null);

  const [getSemester, setGetSemester] = useState(null);
  const [getProgram, setGetProgram] = useState(null);
  const [getSubject, setGetSubject] = useState(null);

  const [getProgId, setGetProgId] = useState(null);

  const [getEditSemester, setGetEditSemester] = useState(null);
  const [getEditProgram, setGetEditProgram] = useState(null);
  const [getEditSubject, setGetEditSubject] = useState(null);

  const [visibleItems, setVisibleItems] = useState(10);
  const [isPaginationVisible, setIsPaginationVisible] = useState(true);

  //загрузка данных с бэка
  useEffect(() => {
    setVisibleItems(10);
    getDataForQR((res) => {
      if (res.error) {
        setTextError(getTextError(res.error));
        setErrorActive(true);
        setIsLoading(false);

      } else {
        setProgramQR(res);
        setSearchResults(res.response);
        setIsLoading(false);
      }
    })

    getDisciplinesForPrograms((res) => {
      if (res.error) {
        setTextError(getTextError(res.error));
        setErrorActive(true);
        setIsLoading(false);

      } else {
        setDataDisciplines(res);
        setIsLoading(false);
      }
    })

    getGroups((res) => {
      if (res.error) {
        setTextError(getTextError(res.error));
        setErrorActive(true);
        setIsLoading(false);

      } else {
        setGroupQR(res);
        setIsLoading(false);
      }
    })

    getAllDisciplines((res) => {
      if (res.error) {
        setTextError(getTextError(res.error));
        setErrorActive(true);
        setIsLoading(false);

      } else {
        setAllDisciplines(res);
        setIsLoading(false);
      }
    })

    getAllWorkTypes((res) => {
      if (res.error) {
        setTextError(getTextError(res.error));
        setErrorActive(true);
        setIsLoading(false);

      } else {
        setAllWorkTypes(res);
        setIsLoading(false);
      }
    })
  }, []);

  //поиск программ
  const handleChange = event => {
    setVisibleItems(10);
    setSearchTerm(event.target.value);

  //   const searchDisciplines = dataDisciplines.response.map(resp => (
  //     resp.disciplines.find(disc => 
  //         disc.discipline.title.toLowerCase().includes(event.target.value.toLowerCase())
  //     )
  // ));
  
  
  //   console.log(searchDisciplines)
    const results = programQR.response.filter(response =>
      response.title.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setSearchResults(results);
  };

  //скрытие кнопки пагинации, если закончились данные для отображения
  useEffect(() => {

    if (searchResults.length <= visibleItems) {
      setIsPaginationVisible(false); // Скрыть кнопку пагинации
    } else {
      setIsPaginationVisible(true); // Показать 
    }
  }, [searchResults, visibleItems]);

  // открытие настроик карточки
  const handleSettingClick = (progId) => {
    setGetProgId(progId);
    setUserStates(prevProgStates => ({
      ...prevProgStates,
      [progId]: !prevProgStates[progId],
    }));
  };

  // кнопка выхода из системы
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  // проверка авторизован ли пользователь
  if (isAuthenticated == false) {
    return <Navigate to='/Log' />
  }

  // установка значений для создание qr
  function handleSelectSemester(data) {
    setSemester(data);
    setProgram(null);
  }
  function handleSelectProgram(data) {
    setProgram(data);
  }
  function handleSelectGroup(data) {
    setGroup(data);
  }

  // функция создание qr
  const generateQRCode = async (studentId, subjectId, editable) => {

    const qrContent = `${studentId},${subjectId},${editable}`;
    const qrUrl = await QRCode.toDataURL(qrContent);
    return qrUrl;
  };

  // функция создания папок и архивов
  const getQR = async () => {

    setIsLoading(true);

    const zip = new JSZip();
    const folder = zip.folder(`${group.label}`);

    getStudents(group.value, (res) => {
      if (res.error) {
        setTextError(getTextError(res.error));
        setErrorActive(true);
        setIsLoading(false);

      } else {
        setStudQR(res);
      }
    })

    for (const stud of studQR.response) {
      const studentFolder = folder.folder(`${stud.lastName} ${stud.firstName} ${stud.middleName}`);
      const discResp = dataDisciplines.response.filter(discipline => discipline.programId === program.value);
      for (const disc of discResp) {
        for (const d of disc.disciplines) {
          const qrCodeUrl = await generateQRCode(stud.id, d.discipline.id, d.workType.isEditable);
          const response = await fetch(qrCodeUrl);
          const qrCodeBlob = await response.blob();
          studentFolder.file(`${d.discipline.title}.png`, qrCodeBlob);
        }
      }
    }

    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, `${group.label}.zip`);
    });
    setIsLoading(false);
  };

  // запись значений фильтров
  function handleSelectSemesterFilter(data) {
    setSemesterFilter(data);
  }
  function handleSelectProgramFilter(data) {
    setProgramFilter(data);
  }

  // функция фильтрации данных
  const getParams = () => {
    let filteredResults = [...programQR.response]; // Создаем копию исходных данных для фильтрации

    if (semesterFilter !== -1) {
      filteredResults = filteredResults.filter(programs => programs.semester === semesterFilter.value);
    }
    if (programFilter !== null) {
      filteredResults = filteredResults.filter(programs => programs.id === programFilter.value);
    }
    if (semesterFilter !== -1 && programFilter !== null) {
      filteredResults = filteredResults.filter(programs => programs.semester === semesterFilter.value);
      filteredResults = filteredResults.filter(programs => programs.id === programFilter.value);
    }

    setSearchResults(filteredResults); // Присваиваем результаты фильтрации обратно в состояние
  }

  // функция сброса фильтров
  const deleteParams = () => {
    setSemesterFilter(-1);
    setProgramFilter(null);
    setSearchResults(programQR.response);
  }

  // запись значений из модального окна создания программ
  function handelGetSemester(data) {
    setGetSemester(data);
  }
  function handelGetProgram(data) {
    setGetProgram(data);
  }
  function handelGetSubject(data) {
    setGetSubject(data);
  }

  function handelGetEditSemester(data) {
    setGetEditSemester(data);
  }
  function handelGetEditProgram(data) {
    setGetEditProgram(data);
  }
  function handelGetEditSubject(data) {
    setGetEditSubject(data);
  }

  const editPrograms = () => {
    setEditActive(true);
    setEmptyModalActive(true);
    setGetEditSemester(programQR.response.find(program => program.id === getProgId) ?
      {
        value: programQR.response.find(program => program.id === getProgId).semester,
        label: programQR.response.find(program => program.id === getProgId).semester
      } : null);
    setGetEditProgram(programQR.response.find(program => program.id === getProgId) ?
      {
        value: programQR.response.find(program => program.id === getProgId).id,
        label: programQR.response.find(program => program.id === getProgId).title
      } : null);
    setGetEditSubject(dataDisciplines.response
      .filter(resp => resp.programId === getProgId) ?
      dataDisciplines.response
        .filter(resp => resp.programId === getProgId)
        .flatMap(resp =>
          resp.disciplines && resp.disciplines.map(disc => ({
            value: disc.discipline.id,
            label: disc.discipline.title
          }))
        ) : null
    );

    // setEditWorkTypes(dataDisciplines.response
    //   .filter(resp => resp.programId === getProgId) ?
    //   dataDisciplines.response
    //     .filter(resp => resp.programId === getProgId)
    //     .flatMap(resp =>
    //       resp.disciplines && resp.disciplines.map(disc => ({
    //         value: disc.workType.id,
    //         label: disc.workType.title
    //       }))
    //     ) : null)

    setEditWorkTypes(
      dataDisciplines.response.filter(resp => resp.programId === getProgId) ? () => {
        let result = {};
        console.log(dataDisciplines.response)
        dataDisciplines.response
        .filter(resp => resp.programId === getProgId)
        .forEach((resp) => {
          resp.disciplines && resp.disciplines.forEach((disc) => {
            result[disc.discipline.id] = {
              value: disc.workType.id,
              label: disc.workType.title
            }
          })
        })
        return result
      } : null
    )

  }

  // функция пагинации
  const loadMore = () => {
    setVisibleItems(prevVisibleItems => prevVisibleItems + 10);
  };

  // задать тип работы для дисциплин
  const handleWorkTypeChange = (selectedOption, subjectId) => {
    addActive && (setWorkTypes(prevWorkTypes => ({
      ...prevWorkTypes,
      [subjectId]: selectedOption
    })));

    editActive && (

      setEditWorkTypes(prevWorkTypes => ({
        ...prevWorkTypes,
        [subjectId]: selectedOption
      })));
  }

  // массив для семестров
  const dataSemester = [{ value: 1, label: 1 },
  { value: 2, label: 2 },
  { value: 3, label: 3 },
  { value: 4, label: 4 },
  { value: 5, label: 5 },
  { value: 6, label: 6 },
  { value: 7, label: 7 },
  { value: 8, label: 8 },
  { value: 9, label: 9 },
  { value: 10, label: 10 },
  { value: 11, label: 11 },
  { value: 12, label: 12 }];

  return (
    <>
      {/* окно загрузки */}
      <Loading active={isLoading} setActive={setIsLoading} />

      {/* шапка страницы */}
      <div className='ad_main_header'>
        <img className='ad_main_logo' src={require('../../img/logo1.png')} />
        <button className='menu_button' onClick={() => setOpen(!isOpen)}>Журналы
          <img className={`button_arrow ${isOpen ? "active" : ""}`} src={require('../../img/nav arrow.png')} />
        </button>
        <nav className={`menu ${isOpen ? "active" : ""}`}>
          <ul className='menu_list'>
            <Link to="/AdminMain" className='link-to'><li className='menu_item'>Последнии записи</li></Link>
            <Link to="/AdminDepartment" className='link-to'><li className='menu_item'>Кафедры</li></Link>
            <Link to="/AdminStud" className='link-to'><li className='menu_item'>Студенты</li></Link>
            <Link to="/AdminDirection" className='link-to'><li className='menu_item'>Направления</li></Link>
          </ul>
        </nav>
        <Link to='/AdminUsers' className='admin-to-users'>Пользователи</Link>
        <Link to='/AdminAccount' className='admin-to-account'>Мой аккаунт</Link>
        <div className='admin-to-exit' onClick={handleLogout}>Выход</div>
      </div>

      {/* блок создания qr */}
      <div className='qr-options'>
        <div className='create-qr'>
          <h2>Создать QR-код</h2>
          <p>Выберите последовательно:</p>
          <div className='filter-qr'>
            <Select
              styles={customStylesQR}
              placeholder="Семестр"
              value={semester}
              onChange={handleSelectSemester}
              isSearchable={true}
              options={dataSemester}
            />
            <Select
              styles={customStyles}
              placeholder="Программа"
              value={program}
              onChange={handleSelectProgram}
              isSearchable={true}
              isDisabled={semester !== -1 ? false : true}
              options={programQR.response.filter(response => response.semester === semester.value).map(response => ({
                value: response.id,
                label: response.title,
              }))}
            />
            <Select
              styles={customStylesQR}
              placeholder="Группа"
              value={group}
              onChange={handleSelectGroup}
              isSearchable={true}
              isDisabled={(semester !== -1 && program !== null) ? false : true}
              options={groupQR.response.map(groups => ({
                value: groups.id,
                label: groups.title,
              }))}
            />
            {/* кнопка создания qr */}
            <button className='btn-create-qr' onClick={getQR} disabled={(semester !== null && program !== null && group !== null) ? false : true}>
              Создать QR
              <img src={require('../../img/qr_white.png')} />
            </button>
          </div>
        </div>

        {/* поиск */}
        <div className='data-option'>
          <div className='search'>
            <input type='text'
              value={searchTerm}
              onChange={handleChange}
              placeholder='Поиск по программе...' />
          </div>

          {/* фильтры */}
          <div className='filter-data-qr'>
            <Select
              styles={customStylesQR}
              placeholder="Семестр"
              value={semesterFilter}
              onChange={handleSelectSemesterFilter}
              isSearchable={true}
              isDisabled={semesterFilter === -1 && programFilter !== null ? true : false}
              options={dataSemester}
            />
            <Select
              styles={customStyles}
              placeholder="Программа"
              value={programFilter}
              onChange={handleSelectProgramFilter}
              isSearchable={true}
              options={semesterFilter !== -1 ? programQR.response.filter(response => response.semester === semesterFilter.value).map(response => ({
                value: response.id,
                label: response.title,
              })) : programQR.response.map(response => ({
                value: response.id,
                label: response.title,
              }))}
            />
            {/* задать заначения фильтрам */}
            <button className='get-params-qr' onClick={getParams} type='submit' ><FontAwesomeIcon icon={faFilter} /></button>
            {/* очистить фильтры */}
            <button className='delete-params-qr' onClick={deleteParams}><FontAwesomeIcon icon={faUndo} /></button>
          </div>
        </div>
      </div>

      {/* кнопка вызова модального окна для создания программы */}
      <button className='add-qr-group' onClick={() => { setEmptyModalActive(true); setAddActive(true); }}>
        <FontAwesomeIcon icon={faPlusCircle} />
      </button>

      {/* все созданные программы */}
      {searchResults.slice(0, visibleItems).map(value => (
        <div className='cart-qr-group' key={value.id}>
          <div className='data-qr'>
            <div className='qr1'>
              <p><span>Семестр: </span>{value.semester}</p>
              <p><span>Программа: </span>{value.title}</p>
            </div>

            <div className='qr2'>
              <span>Дисциплины: </span>
              <div className='dicip'>
                {dataDisciplines.response
                  .filter(resp => resp.programId === value.id)
                  .map(resp => (
                    resp.disciplines && resp.disciplines.map(disc => (
                      <p key={disc.discipline.id}>{disc.discipline.title}</p>
                    ))
                  ))}
              </div>
            </div>
          </div>

          {/* кнопки редактирования и удаления программы */}
          <button
            className='qr-setting'
            onClick={() => { handleSettingClick(value.id) }}
          >
            <img src={require('../../img/setting.png')} alt='setting' />
          </button>
          <div className={`button-edit-delete ${userStates[value.id] ? 'active' : ''}`}>
            <button onClick={editPrograms}>
              <img src={require('../../img/edit.png')} alt='edit' />
            </button>
            <button>
              <img src={require('../../img/delete.png')} alt='delete' />
            </button>
          </div>
        </div>
      ))}

      {/* кнопка пагинации */}
      {isPaginationVisible && (
        <button className='btn-loadMore' onClick={loadMore}>
          Загрузить ещё
        </button>
      )}

      {/* модальное окно создания или редактирования программы */}
      <Empty_modal active={emptyModalActive}>
        <div className='modal-qr'>
          <>
            {addActive && (<>
              <Select
                styles={customStylesModal}
                placeholder="Семестр"
                value={getSemester}
                onChange={handelGetSemester}
                isSearchable={true}
                options={dataSemester}
              />
              <Select
                styles={customStylesModal}
                placeholder="Программа"
                value={getProgram}
                onChange={handelGetProgram}
                isSearchable={true}
                options={programQR.response.map(response => ({
                  value: response.id,
                  label: response.title
                }))}
              />
              <Select
                styles={customStylesModal}
                placeholder="Дисциплины"
                value={getSubject}
                onChange={handelGetSubject}
                isSearchable={true}
                isMulti={true}
                options={allDisciplines.response.map(response => ({
                  value: response.id,
                  label: response.title
                }))}
              />
            </>)}
            {editActive && (
              <>
                <Select
                  styles={customStylesModal}
                  placeholder="Семестр"
                  value={getEditSemester}
                  onChange={handelGetEditSemester}
                  isSearchable={true}
                  options={dataSemester}
                />

                <Select
                  styles={customStylesModal}
                  placeholder="Программа"
                  value={getEditProgram}
                  onChange={handelGetEditProgram}
                  isSearchable={true}
                  options={programQR.response.map(response => ({
                    value: response.id,
                    label: response.title
                  }))}
                />

                <Select
                  styles={customStylesModal}
                  placeholder="Дисциплины"
                  value={getEditSubject}
                  onChange={handelGetEditSubject}
                  isSearchable={true}
                  isMulti={true}
                  options={allDisciplines.response.map(response => ({
                    value: response.id,
                    label: response.title
                  }))}
                />

              </>)
            }

          </>
        </div>

        <div className='modal-button'>
          <button onClick={() => setModalActive(true)}>Далее</button>
          <button onClick={() => { setEmptyModalActive(false); setTimeout(() => { setAddActive(false); setEditActive(false) }, 400) }}>Отмена</button>
        </div>
      </Empty_modal>
      <Modal active={modalActive} setActive={setModalActive}>
        <b className='h-discip'>Задайте тип работы выбранным дисциплинам</b>

        {addActive && (getSubject !== null ? getSubject.map((subject) => (
          <div className='content-discip' key={subject.value}>
            <p>{subject.label}</p>
            <Select
              styles={customStylesTypeOfWork}
              placeholder="Тип работы"
              value={workTypes[subject.value]}
              onChange={(selectedOption) => handleWorkTypeChange(selectedOption, subject.options)}
              isSearchable={true}
              options={allWorkTypes.response.map(res => ({
                value: res.id,
                label: res.title
              }
              ))}
            />
          </div>
        )) : '')}

        {editActive && (getEditSubject !== null ? getEditSubject.map((subject) => (
          <div className='content-discip' key={subject.value}>
            
            <p>{subject.label}</p>
            <Select
              styles={customStylesTypeOfWork}
              placeholder="Тип работы"
              value={editWorkTypes[subject.value]} // Используйте значение из editWorkTypes для соответствующей дисциплины
              onChange={(selectedOption) => handleWorkTypeChange(selectedOption, subject.value)}
              isSearchable={true}
              options={allWorkTypes.response.map(res => ({
                value: res.id,
                label: res.title
              }))}
            />
          </div>
        )) : '')}



      </Modal>

      {/* модальное окно ошибки */}
      <Error_modal active={errorActive} setActive={setErrorActive} text={textError} setText={setTextError} />
    </>
  )
}

export default CreateQR