import React, { useEffect, useState, useRef } from 'react';
import './Admin_header.css';
import './CreateQR.css'
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Select from 'react-select';
// import QRCode from 'qrcode';
import QRCode from "qrcode.react";
import JSZip, { filter, forEach } from "jszip";
import Modal from '../Modal/Modal';
import { faFilter, faUndo, faCheckCircle, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loading from '../Modal/Loading';
import { getAllGroups, getTextError, editDisciplines, generateQrCodes, getAllDisciplines, getAllWorkTypes, getDataPrograms, getDirectivitiesPrograms } from '../../network';
import Error_modal from '../Modal/Error_modal';
// import FileSaver from 'file-saver';
import { customStyles, customStylesModal, customStylesQR, customStylesTypeOfWork } from '../Select_style/Select_style';
import Empty_modal from '../Modal/Empty_modal';
import Error_empty from '../Modal/Error_empty';
import Error_ok from '../Modal/Error_ok';
import { saveAs } from 'file-saver';


function CreateQR() {
  const [isOpen, setOpen] = useState(false);
  const [emptyModalActive, setEmptyModalActive] = useState(false);
  const [editModalActive, setEditModalActive] = useState(false);
  const [userStates, setUserStates] = useState({});
  const [errorGroup, setErrorGroup] = useState('');
  const [errorDis, setErrorDis] = useState('');
  const [errorType, setErrorType] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [qrUrl, setQrUrl] = useState('');

  const [addActive, setAddActive] = useState(false);
  const [editActive, setEditActive] = useState(false);
  const [dataDisciplines, setDataDisciplines] = useState({
    response: [],
    error: null,
    success: true
  });

  const [allDisciplines, setAllDisciplines] = useState([]);

  const [allWorkTypes, setAllWorkTypes] = useState([]);

  const [programQR, setProgramQR] = useState([]);
  const [copyData, setCopyData] = useState([]);

  const [allGroups, setAllGroups] = useState([]);
  const [directivitiesPrograms, setDirectivitiesPrograms] = useState([]);

  const [groupQR, setGroupQR] = useState([]);

  const [studQR, setStudQR] = useState(null);

  const [workTypes, setWorkTypes] = useState({});
  const [editWorkTypes, setEditWorkTypes] = useState({});

  const [errorActive, setErrorActive] = useState(false);
  const [textError, setTextError] = useState('');
  const [codeText, setCodeText] = useState('');

  const [semester, setSemester] = useState(null);
  const [program, setProgram] = useState(null);
  const [group, setGroup] = useState(null);
  const [editTypes, setEditTypes] = useState([]);

  const [semesterFilter, setSemesterFilter] = useState(null);
  const [directivityFilter, setDirectivityFilter] = useState(null);

  const [qrParams, setQRParams] = useState({});

  const [directivityId, setDirectivityId] = useState(null);
  const [getProgram, setGetProgram] = useState(null);
  const [getSubject, setGetSubject] = useState(null);

  const [getProgId, setGetProgId] = useState(null);
  const [setting, setSetting] = useState(null);
  const [idProgram, setIdProgram] = useState(null);
  const [getEditSemester, setGetEditSemester] = useState(null);
  const [getEditProgram, setGetEditProgram] = useState(null);
  const [getEditSubject, setGetEditSubject] = useState(null);

  const [visibleItems, setVisibleItems] = useState(30);
  const [hasMoreData, setHasMoreData] = useState(true);
  const menuRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [debouncedInputValue, setDebouncedInputValue] = useState("");
  const [dataQR, setDataQR] = useState([]);

  const [offset, setOffset] = useState(0);
  const limit = 30; // Количество элементов на странице
  const [isSetOpen, setIsSetOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const modalRef = useRef(null);

  const [titleProgram, setTitleProgram] = useState('');
  const [newTypes, setNewType] = useState(null);
  const [newDisc, setNewDisc] = useState(null);

  const [errorEmptyActive, setErrorEmptyActive] = useState(false);
  const [errorOkActive, setErrorOkActive] = useState(false);

  const [disciplineAndType, setDisciplineAndType] = useState([]);
  const [arrayUInt8, setArrayUInt8] = useState([]);


  const [inputText, setInputText] = useState('');
  const [qrCodeText, setQRCodeText] = useState('');
  let selectGroups = '';

  const openModal = (itemId) => {


    setSelectedItemId(itemId);
    setIsSetOpen(true);
  };

  const closeModal = () => {
    setIsSetOpen(false);

  };

  // Обработчик клика вне модального окна
  const handleClickOutside = (event) => {

    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeModal();

    }
  };
  useEffect(() => {

    // Добавляем обработчик клика вне модального окна при открытии модального окна
    if (isSetOpen) {
      document.addEventListener('click', handleClickOutside);

    } else {
      document.removeEventListener('click', handleClickOutside);

    }

    // Очищаем обработчик при размонтировании компонента
    return () => {

      document.removeEventListener('click', handleClickOutside);

    };
  }, [isSetOpen]);
  // useEffect(() => { console.log(studQR) }, [studQR])

  //загрузка данных с бэка
  useEffect(() => {

    setIsLoading(true);
    setHasMoreData(true);
    getDataPrograms(offset, limit, qrParams, debouncedInputValue, (res) => {
      if (res.error) {
        setTextError(getTextError(res.error));
        setErrorActive(true);
      } else {
        if (res.response.entries.length < limit) {
          setHasMoreData(false); // Если загружено меньше, чем лимит, значит, больше данных нет
        }

        // Если это первая страница, просто устанавливаем новые данные
        if (offset === 0) {
          setProgramQR(res.response.entries);
          setSearchResults(res.response.entries);
          setCopyData(structuredClone(res.response.entries));

        } else {
          // Иначе обновляем данные
          setProgramQR(prevData => [...prevData, ...res.response.entries]);
          setSearchResults(prevResults => [...prevResults, ...res.response.entries]);
          setCopyData(prevData => structuredClone([...prevData, ...res.response.entries]));

        }
      }
      setIsLoading(false);
    }).catch((error) => {
      setTextError(error.message);
      setCodeText(error.code);
      setErrorEmptyActive(true);
      setIsLoading(false);
    })

  }, [offset, limit, qrParams, debouncedInputValue]);

  useEffect(() => {
    // Функция, которая вызывается при клике вне меню
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
      if (event.srcElement.offsetParent && !(event.srcElement.offsetParent.className === 'qr-setting')) {
        closeModal();
      }
    };

    // Добавление обработчика события клика для всего документа
    document.addEventListener("click", handleClickOutside);

    // Очистка обработчика при размонтировании компонента
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);



  useEffect(() => {
    setIsLoading(true);
    getDirectivitiesPrograms((res) => {
      if (res.error) {
        setTextError(getTextError(res.error));
        setErrorActive(true);
      } else {
        setDirectivitiesPrograms(res.response.directivities);
      }
      setIsLoading(false);
    }).catch((error) => {
      setTextError(error.message);
      setCodeText(error.code);
      setErrorEmptyActive(true);
      setIsLoading(false);
    });

    getAllGroups((res) => {
      if (res.error) {
        setTextError(getTextError(res.error));
        setErrorActive(true);
      } else {
        setAllGroups(res.response);
      }
      setIsLoading(false);
    }).catch((error) => {
      setTextError(error.message);
      setCodeText(error.code);
      setErrorEmptyActive(true);
      setIsLoading(false);
    });

    getAllWorkTypes((res) => {
      if (res.error) {
        setTextError(getTextError(res.error));
        setErrorActive(true);
      } else {
        setAllWorkTypes(res.response);
      }
      setIsLoading(false);
    }).catch((error) => {
      setTextError(error.message);
      setCodeText(error.code);
      setErrorEmptyActive(true);
      setIsLoading(false);
    });

    getAllDisciplines((res) => {
      if (res.error) {
        setTextError(getTextError(res.error));
        setErrorActive(true);
      } else {
        setAllDisciplines(res.response);
      }
      setIsLoading(false);
    }).catch((error) => {
      setTextError(error.message);
      setCodeText(error.code);
      setErrorEmptyActive(true);
      setIsLoading(false);
    });

  }, []);

  useEffect(() => {
    if (copyData) {
      const program = copyData.find(res => res.program.id === idProgram);
      if (program) {
        const initialEditTypes = program.disciplines.reduce((acc, discipline) => {
          acc[discipline.id] = {
            value: discipline.workTypeId,
            label: allWorkTypes.find(r => r.id === discipline.workTypeId)?.title || ''
          };
          return acc;
        }, {});
        setEditTypes(initialEditTypes);
      }
    }
  }, [copyData, idProgram, allWorkTypes, editModalActive]);
  // console.log(editTypes);

  //поиск программ
  const handleInputValue = e => {
    setInputValue(e.target.value);

  };
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setOffset(0);
      setDebouncedInputValue(inputValue);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [inputValue, 1000]);

  useEffect(() => {
    setSearchResults(programQR);
  }, [programQR])

  // кнопка выхода из системы
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  // // проверка авторизован ли пользователь
  if (isAuthenticated == false) {
    return <Navigate to='/' />
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



  // запись значений фильтров
  function handleSelectSemesterFilter(data) {
    setSemesterFilter(data);
  }
  function handelSelectDirectivityFilter(data) {
    setDirectivityFilter(data);
  }

  function handelSelectGroupsQR(data) {
    setGroupQR(data);
  }

  function handleNewDisciplineChange(data) {
    setNewDisc(data);
  }
  function handleNewWorkTypeChange(data) {
    setNewType(data);
  }

  // функция фильтрации данных
  const getParams = () => {
    setIsLoading(true);
    setOffset(0);

    setQRParams({
      semester: semesterFilter ? semesterFilter.value : null,
      directivity: directivityFilter ? directivityFilter.value : null,
    });
  }

  // функция сброса фильтров
  const deleteParams = () => {
    setQRParams({});
    setSemesterFilter(null);
    setDirectivityFilter(null);
  }


  // функция загрузки данных пагинации
  const loadMore = () => {
    setOffset(prevOffset => prevOffset + limit);
  };

  // задать тип работы для дисциплин
  const handleWorkTypeChange = (selectedOption, disciplineId) => {
    setEditTypes(prevState => ({
      ...prevState,
      [disciplineId]: selectedOption
    }));
  };

  async function editData(discip, type) {
    setIsLoading(true);
    await editDisciplines(idProgram, discip, type, (res) => {
      if (res.success) {
        setProgramQR(structuredClone(copyData));
      } else {
        setTextError(res.message);
        setCodeText(res.code);
        setErrorEmptyActive(true);
      }
      setIsLoading(false);
    }).catch((error) => {
      setTextError(error.message);
      setCodeText(error.code);
      setErrorOkActive(true);
      setIsLoading(false);
    });
  }



  const handleSave = () => {
    const disciplineIds = Object.keys(editTypes).join(',');
    const workTypeIds = Object.values(editTypes).map(type => type.value).join(',');
    console.log(`Сохраненные данные: дисциплины - ${disciplineIds}, типы работ - ${workTypeIds}`);
    editData(disciplineIds, workTypeIds);
    setEditModalActive(false);
    document.body.style.overflow = '';
    const adMainHeaders = document.getElementsByClassName('ad_main_header');
    for (let i = 0; i < adMainHeaders.length; i++) {
      adMainHeaders[i].style.paddingRight = `10px`;
    }
    document.getElementById('body-content').style.paddingRight = ``;


  };

  const handleCancel = () => {
    setSearchResults(programQR);
    setCopyData(structuredClone(programQR));
    setEditModalActive(false);
    document.body.style.overflow = '';
    const adMainHeaders = document.getElementsByClassName('ad_main_header');
    for (let i = 0; i < adMainHeaders.length; i++) {
      adMainHeaders[i].style.paddingRight = `10px`;
    }
    document.getElementById('body-content').style.paddingRight = ``;

  };

  const getQR = () => {
    setIsLoading(true);
    setErrorGroup('');
    if (groupQR.length === 0) {
      setErrorGroup('Выберите группу(ы)');
      setIsLoading(false);

    } else {
      for (const group of groupQR) {
        selectGroups = selectGroups + group.value + ',';
      }
      if (selectGroups !== '') {
        generateQrCodes(idProgram, selectGroups, async (res) => {
          if (res.error) {
            setTextError(getTextError(res.error));
            setErrorActive(true);
            setIsLoading(false);
          } else {
            let titleZip = '';
            for (const prog of programQR) {
              if (prog.program.id === idProgram) {
                titleZip = `${prog.directivity.title}_${prog.grade.title}_${prog.program.semester}`;
              }
            }
            const blob = new Blob([res], { type: "application/zip" });
            saveAs(blob, `${titleZip}.zip`);
          }
          setIsLoading(false);

        }).catch((error) => {
          setTextError(error.message);
          setCodeText(error.code);
          setErrorOkActive(true);
          setIsLoading(false);
        });
      }
      setEmptyModalActive(false);
      document.body.style.overflow = '';
      const adMainHeaders = document.getElementsByClassName('ad_main_header');
      for (let i = 0; i < adMainHeaders.length; i++) {
        adMainHeaders[i].style.paddingRight = `10px`;
      }
      document.getElementById('body-content').style.paddingRight = ``;
      setErrorGroup('');

    }
  }

  const addDiscipline = () => {
    setErrorDis('');
    setErrorType('');
    if (newDisc === null || newTypes === null) {

      if (newDisc === null) {
        setErrorDis('Выберите дисциплину');
      }
      if (newTypes === null) {
        setErrorType('Выберите тип работы');
      }
    } else {
      if (newDisc && newTypes) {
        setEditTypes(prevState => ({
          ...prevState,
          [newDisc.value]: newTypes
        }));
        setCopyData(prevState => {
          const updatedProgram = prevState.find(res => res.program.id === idProgram);
          if (updatedProgram) {
            updatedProgram.disciplines = [{ id: newDisc.value, title: newDisc.label, workTypeId: newTypes.value, departmentId: allDisciplines.find(r => r.id === newDisc.value).departmentId }, ...updatedProgram.disciplines];
          }
          return [...prevState];
        });
        setNewDisc(null);
        setNewType(null);
        setErrorDis('');
        setErrorType('');
      }
    }

  };

  const deleteData = (disciplineId) => {
    setCopyData(prevState => {
      const updatedProgram = prevState.find(res => res.program.id === idProgram);
      if (updatedProgram) {
        updatedProgram.disciplines = updatedProgram.disciplines.filter(discipline => discipline.id !== disciplineId);
      }
      return [...prevState];
    });
    setEditTypes(prevState => {
      const updatedEditTypes = { ...prevState };
      delete updatedEditTypes[disciplineId];
      return updatedEditTypes;
    });
  };
  // console.log(programQR)
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

  const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

  return (
    <>
      {/* окно загрузки */}
      <Loading active={isLoading} setActive={setIsLoading} />

      {/* шапка страницы */}
      <div className='ad_main_header'>
        <div className='ad_main_header-content'>
          <img className='ad_main_logo' src={require('../../img/logo1.webp')} />
          <button className='menu_button' ref={menuRef} onClick={() => setOpen(!isOpen)}>Журналы
            <img className={`button_arrow ${isOpen ? "active" : ""}`} src={require('../../img/nav arrow.png')} />
          </button>
          <nav className={`menu ${isOpen ? "active" : ""}`}>
            <ul className='menu_list'>
              <Link to="/admin/AdminMain" className='link-to'><li className='menu_item'>Последние записи</li></Link>
              <Link to="/admin/AdminDepartment" className='link-to'><li className='menu_item'>Кафедры</li></Link>
              <Link to="/admin/AdminStud" className='link-to'><li className='menu_item'>Студенты</li></Link>
              <Link to="/admin/AdminGroup" className='link-to'><li className='menu_item'>Группы</li></Link>
              <Link to="/admin/AdminDirection" className='link-to'><li className='menu_item'>Направления</li></Link>
            </ul>
          </nav>

          {/* <Link to='/AdminUsers' className='admin-to-users'>Пользователи</Link> */}

          <Link style={{ visibility: 'hidden' }} className='admin-to-qr' to="/admin/CreateQR">
            <p>Создать QR-код</p>
            <img className='qr-arrow' src={require('../../img/arrow.png')} />
          </Link>

          <Link to='/admin/AdminAccount' className='admin-to-account'>Мой аккаунт</Link>
          <div className='admin-to-exit' onClick={handleLogout}>Выход</div>
        </div>
      </div>

      <QRCode
        style={{ display: 'none' }}
        id="123456"
        value={`${qrUrl}`}
        size={290}
        level={"H"}
        includeMargin={true}
      />


      {/* поиск */}
      <div id='body-content'>
        <div className='admin-main-search'>
          <input
            type='text'
            value={inputValue}
            onChange={handleInputValue}
            placeholder='Поиск...'
          />
        </div>

        {/* фильтры */}
        <div className='filters'>
          <div>
            <Select
              styles={customStyles}
              placeholder="Семестр"
              value={semesterFilter}
              onChange={handleSelectSemesterFilter}
              isSearchable={true}
              // isDisabled={semesterFilter === -1 && directivityFilter !== null ? true : false}
              options={dataSemester}
            />
          </div><div>
            <Select
              styles={customStyles}
              placeholder="Направленность"
              value={directivityFilter}
              onChange={handelSelectDirectivityFilter}
              isSearchable={true}
              options={directivitiesPrograms.map(res =>
              ({
                value: res.id,
                label: res.title
              })
              )}
            /></div>
          {/* задать заначения фильтрам */}
          <button className='get-params' onClick={getParams} type='submit' ><FontAwesomeIcon icon={faFilter} /></button>
          {/* очистить фильтры */}
          <button className='delete-params' onClick={deleteParams}><FontAwesomeIcon icon={faUndo} /></button>
        </div>
        {/* </div> */}


        {/* кнопка вызова модального окна для создания программы */}
        {/* <button className='add-qr-group' onClick={() => { setEmptyModalActive(true); setAddActive(true); }}>
        <FontAwesomeIcon icon={faPlusCircle} />
      </button> */}

        {/* все созданные программы */}
        {searchResults.map(value => (
          <div className='cart-qr-group' key={value.id}>
            <div className='data-qr'>
              <div className='qr1'>
                <p><span>Семестр: </span>{value.program.semester}</p>
                <p><span>Степень образования: </span>{value.grade.title}</p>
                <p><span>Направленность: </span>{value.directivity.title}</p>
              </div>
              <div className='qr2'>
                <span>Дисциплины: </span>
                <div className='dicip'>
                  {value.disciplines.map((res) => (
                    <p>{res.title}</p>
                  ))}
                </div>
              </div>
            </div>

            <button
              className='qr-setting'
              onClick={() => {
                if (isSetOpen === true && value.program.id !== selectedItemId) {
                  closeModal();
                  openModal(value.program.id);
                }
                else if (isSetOpen === true) {
                  closeModal();
                }
                else {
                  openModal(value.program.id);
                }
              }}
            >
              <img src={require('../../img/setting.png')} alt='setting' />
            </button>

            {isSetOpen && selectedItemId === value.program.id && (
              <div className={`button-edit-delete ${isSetOpen && selectedItemId === value.program.id ? 'active' : ''}`}>
                <button className='btn-create-qr' onClick={() => {
                  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
                  document.body.style.overflow = 'hidden';
                  const adMainHeaders = document.getElementsByClassName('ad_main_header');
                  for (let i = 0; i < adMainHeaders.length; i++) {
                    adMainHeaders[i].style.paddingRight = `${scrollbarWidth + 10}px`;
                  }
                  document.getElementById('body-content').style.paddingRight = `${scrollbarWidth}px`;
                  setErrorGroup('');
                  setGroupQR([]);
                  setIdProgram(value.program.id);
                  setDirectivityId(value.directivity.id);
                  setEmptyModalActive(true)
                }}>
                  <img src={require('../../img/qr_white.png')} />
                </button>
                <button onClick={() => {
                  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
                  document.body.style.overflow = 'hidden';
                  const adMainHeaders = document.getElementsByClassName('ad_main_header');
                  for (let i = 0; i < adMainHeaders.length; i++) {
                    adMainHeaders[i].style.paddingRight = `${scrollbarWidth + 10}px`;
                  }
                  document.getElementById('body-content').style.paddingRight = `${scrollbarWidth}px`;
                  setErrorDis('');
                  setErrorType('');
                  setNewDisc(null);
                  setNewType(null);
                  setIdProgram(value.program.id);
                  setTitleProgram(`${value.directivity.title}, ${value.grade.title.toLowerCase()}, ${value.program.semester} семестр`);
                  setEditModalActive(true);
                }}>
                  <img src={require('../../img/edit.png')} alt='edit' />
                </button>
                {/* <button>
                <img src={require('../../img/delete.png')} alt='delete' />
              </button> */}


              </div>
            )}
          </div>
        ))}

        {hasMoreData && (
          <button className='btn-loadMore' onClick={loadMore}>
            Загрузить ещё
          </button>
        )}
      </div>
      <Empty_modal active={emptyModalActive} setActive={setEmptyModalActive}>
        <div className='modal-groups'>
          <div><p><b>Выберите группы: </b></p></div>
          <div>
            <Select
              styles={customStylesModal}
              placeholder="Группа"
              value={groupQR}
              onChange={handelSelectGroupsQR}
              isSearchable={true}
              isMulti={true}
              options={allGroups.filter(r => r.directivityId === directivityId).map(res =>
              ({
                value: res.id,
                label: res.title
              })
              )} />
            {(errorGroup !== '') && <p style={{ color: 'red', fontSize: '12px', position: 'absolute' }} >{errorGroup}</p>}

          </div>
          <div className='modal-button'>
            <button onClick={() => {
              getQR();

            }}>Сгенерировать</button>

            <button onClick={() => {
              setEmptyModalActive(false);
              document.body.style.overflow = '';
              const adMainHeaders = document.getElementsByClassName('ad_main_header');
              for (let i = 0; i < adMainHeaders.length; i++) {
                adMainHeaders[i].style.paddingRight = `10px`;
              }
              document.getElementById('body-content').style.paddingRight = ``;

            }}>Отмена</button>
          </div>
        </div>
      </Empty_modal>


      <Empty_modal active={editModalActive} setActive={setEditModalActive}>
        <div className='modal-disciplines'>
          <p><b>{titleProgram}</b></p>
          <div className='add-content'>
            <div>
              <Select
                styles={customStylesTypeOfWork}
                placeholder="Дисциплина"
                value={newDisc}
                onChange={handleNewDisciplineChange}
                isSearchable={true}
                options={allDisciplines.map(res => ({
                  value: res.id,
                  label: res.title
                }))} />
              {(errorDis !== '') && <p style={{ color: 'red', fontSize: '12px', position: 'absolute' }} >{errorDis}</p>}

            </div>
            <div>
              <Select
                styles={customStylesTypeOfWork}
                placeholder="Тип работы"
                value={newTypes}
                onChange={handleNewWorkTypeChange}
                isSearchable={true}
                options={allWorkTypes.map(res => ({
                  value: res.id,
                  label: res.title
                }))} />
              {(errorType !== '') && <p style={{ color: 'red', fontSize: '12px', position: 'absolute' }} >{errorType}</p>}

            </div>
            <button onClick={addDiscipline}>
              <FontAwesomeIcon icon={faCheckCircle} />
            </button>
          </div>
          <div className='edit-conteiner'>
            {copyData !== null ? (
              copyData.find(res => res.program.id === idProgram)?.disciplines.map(val => (
                <div className='edit-content' key={val.id}>
                  <p>{val.title}</p>
                  <Select
                    styles={customStylesTypeOfWork}
                    placeholder="Выберите тип работы"
                    value={editTypes[val.id]}
                    onChange={(selectedOption) => handleWorkTypeChange(selectedOption, val.id)}
                    isSearchable={true}
                    options={allWorkTypes.map(res => ({
                      value: res.id,
                      label: res.title
                    }))} />

                  <button onClick={() => { deleteData(val.id); console.log(programQR.find(res => res.program.id === idProgram)) }}>
                    <FontAwesomeIcon icon={faXmarkCircle} />
                  </button>
                </div>
              ))
            ) : ''}
          </div>
          <div className='modal-button'>
            <button onClick={handleSave}>Сохранить</button>
            <button onClick={handleCancel}>Отмена</button>
          </div>
        </div>
      </Empty_modal>




      {/* модальное окно ошибки */}
      <Error_modal active={errorActive} setActive={setErrorActive} text={textError} setText={setTextError} />
      <Error_empty active={errorEmptyActive} text={textError} codeText={codeText} />
      <Error_ok active={errorOkActive} setActive={setErrorOkActive} text={textError} codeText={codeText} />
    </>
  )
}

export default CreateQR