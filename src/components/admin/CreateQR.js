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
import { getAllGroups, getTextError, getDisciplinesForPrograms, getGroups, getStudents, getAllDisciplines, getAllWorkTypes, getDataPrograms, getDirectivitiesPrograms, getAllStudents, getStudentsByGroups } from '../../network';
import Error_modal from '../Modal/Error_modal';
import { saveAs } from 'file-saver';
import { customStyles, customStylesModal, customStylesQR, customStylesTypeOfWork } from '../Select_style/Select_style';
import Empty_modal from '../Modal/Empty_modal';
import Admin_header from './Admin_header';

function CreateQR() {
  const [isOpen, setOpen] = useState(false);
  const [emptyModalActive, setEmptyModalActive] = useState(false);
  const [editModalActive, setEditModalActive] = useState(false);
  const [userStates, setUserStates] = useState({});

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

  const [offset, setOffset] = useState(0);
  const limit = 30; // Количество элементов на странице
  const [isSetOpen, setIsSetOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const modalRef = useRef(null);

  const [titleProgram, setTitleProgram] = useState('');
  const [newTypes, setNewType] = useState(null);
  const [newDisc, setNewDisc] = useState(null);

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
    // console.log(qrParams)
    getDataPrograms(offset, limit, qrParams, debouncedInputValue, (res) => {
      console.log(res.response)
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

        } else {
          // Иначе обновляем данные
          setProgramQR(prevData => [...prevData, ...res.response.entries]);
          setSearchResults(prevResults => [...prevResults, ...res.response.entries]);

        }
      }
      setIsLoading(false);
    })

  }, [offset, limit, qrParams, debouncedInputValue, editModalActive]);

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
    });
    getAllGroups((res) => {
      if (res.error) {
        setTextError(getTextError(res.error));
        setErrorActive(true);
      } else {
        setAllGroups(res.response);
      }
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
    });
    getAllDisciplines((res) => {
      if (res.error) {
        setTextError(getTextError(res.error));
        setErrorActive(true);
      } else {
        setAllDisciplines(res.response);
      }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    // console.log(studQR)
    if (studQR !== null) {
      createZip();
    }

  }, [studQR])

  useEffect(() => {
    console.log(editTypes);
  }, [editTypes]);

  useEffect(() => {
    if (programQR) {
      const program = programQR.find(res => res.program.id === idProgram);
      if (program) {
        const initialEditTypes = program.disciplines.reduce((acc, discipline) => {
          acc[discipline.id] = {
            value: discipline.workTypeId,
            label: allWorkTypes.find(r => r.id === discipline.workTypeId)?.title || ''
          };
          return acc;
        }, []);
        // console.log(initialEditTypes);

        setEditTypes(initialEditTypes);
      }
    }
  }, [programQR, idProgram, allWorkTypes, editModalActive]);
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

  // кнопка выхода из системы
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  // проверка авторизован ли пользователь
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



  const generateQR = async (department, discipline, studName, workType) => {
    // Генерируем QR-код и сохраняем его в формате PNG
    // setTimeout(() => {

    // }, 500)

  }

  const getQR = () => {
    console.log(groupQR);
    for (const group of groupQR) {
      selectGroups = selectGroups + group.value + ',';
    }
    if (selectGroups !== '') {
      getStudentsByGroups(selectGroups, (res) => {
        if (res.error) {
          setTextError(getTextError(res.error));
          setErrorActive(true);
          setIsLoading(false);
        } else {
          setStudQR(res.response);
          console.log(res.response)
        }
      });
    }
  }

  const setQrUrlAsync = (value) => {
    return new Promise((resolve) => {
      setQrUrl(value);
      resolve();
    });
  }
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const createZip = async () => {
    setIsLoading(true);
    // const canvas = document.getElementById("123456");
    // const pngUrl = canvas.toDataURL("image/png");

    // // Получаем бинарные данные из Data URL
    // const base64Data = pngUrl.replace(/^data:image\/png;base64,/, "");
    // const binaryData = atob(base64Data);
    // const uint8Array = new Uint8Array(binaryData.length);
    // for (let i = 0; i < binaryData.length; i++) {
    //   uint8Array[i] = binaryData.charCodeAt(i);
    // }
    // setTimeout(async () => {
    let titleZip = '';
    for (const prog of programQR) {
      if (prog.program.id === idProgram) {
        titleZip = `${prog.directivity.title}_${prog.grade.title}_${prog.program.semester}`;
      }
    }
    // const QrCodeData = document.getElementById("123456");

    // Создаем новый ZIP-архив
    const zip = new JSZip();

    for (const group of groupQR) {
      // Создаем папку для группы
      const groupFolder = zip.folder(group.label);

      for (const stud of studQR) {
        // Проверяем, принадлежит ли студент текущей группе
        if (stud.groupId === group.value) {
          for (const studName of stud.students) {
            // Создаем папку для студента внутри папки группы
            const studentFolder = groupFolder.folder(studName.title);

            for (const prog of programQR) {
              if (prog.program.id === idProgram) {
                for (const disc of prog.disciplines) {
                  // console.log(selectGroups);

                  // Создаем QR URL для каждого дисциплины
                  // await generateQR(disc.departmentId, disc.title, studName.title, disc.workTypeId);




                  // setQrUrl(disc.departmentId + ',' + disc.title + ',' + studName.title + ',' + disc.workTypeId);
                  // QrCodeData.value = `${disc.departmentId + ',' + disc.title + ',' + studName.title + ',' + disc.workTypeId}`;

                  await setQrUrlAsync(disc.departmentId + ',' + disc.id + ',' + studName.id + ',' + disc.workTypeId);
                  await sleep(10);
                  const canvas = document.getElementById("123456");
                  const pngUrl = canvas.toDataURL("image/png");
                  // const pngUrl = QrCodeData.toDataURL("image/png");
                  const base64Data = pngUrl.replace(/^data:image\/png;base64,/, "");
                  const binaryData = atob(base64Data);
                  const uint8Array = new Uint8Array(binaryData.length);
                  for (let i = 0; i < binaryData.length; i++) {
                    uint8Array[i] = binaryData.charCodeAt(i);
                  }
                  console.log(pngUrl)

                  // Сохраняем QR-код в папке студента
                  studentFolder.file(`${disc.title}.png`, uint8Array);

                }
              }
            }
          }
        }
      }
    }

    // Генерируем ZIP-архив и скачиваем его
    // setTimeout(async () => {
    zip.generateAsync({ type: "blob" }).then((content) => {
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(content);
      downloadLink.download = `${titleZip}.zip`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    });
    setStudQR(null);
    setIsLoading(false);
    // }, 10000);
    // }, 1500);

  }
  // useEffect(() => {
  //   if (programQR) {
  //     const program = programQR.find(res => res.program.id === idProgram);
  //     if (program) {
  //       const initialEditTypes = program.disciplines.reduce((acc, discipline) => {
  //         acc[discipline.id] = {
  //           value: discipline.workTypeId,
  //           label: allWorkTypes.find(r => r.id === discipline.workTypeId)?.title || ''
  //         };
  //         return acc;
  //       }, {});
  //       // console.log(initialEditTypes);

  //       setEditTypes(initialEditTypes);
  //     }
  //   }
  // }, [programQR, idProgram, allWorkTypes, editModalActive]);
  const addDiscipline = () => {

  }

  const deleteData = (IdData) => {
    const newData = programQR.map(res => {
      if (res.program.id === idProgram) {
        res.disciplines = res.disciplines.filter(a => a.id !== IdData)
      }
      return res
    });
    // const newData = programQR.filter(r=>r.program.id === idProgram).map(res => {
    //     res.disciplines = res.disciplines.filter(a => a.id !== IdData)
    // });
    setProgramQR(newData);
    // console.log('jfk', dataDisciplines)
    // console.log(programQR.find(res => res.program.id === idProgram).disciplines.filter((a) => a.id !== IdData))
    // setProgramQR(programQR.find(res => res.program.id === idProgram).disciplines.filter((a) => a.id !== IdData))
    // setEditTypes(editTypes.filter((a) => a.id !== IdData));

  }
  console.log(programQR)
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
        <button className='menu_button' ref={menuRef} onClick={() => setOpen(!isOpen)}>Журналы
          <img className={`button_arrow ${isOpen ? "active" : ""}`} src={require('../../img/nav arrow.png')} />
        </button>
        <nav className={`menu ${isOpen ? "active" : ""}`}>
          <ul className='menu_list'>
            <Link to="/AdminMain" className='link-to'><li className='menu_item'>Последние записи</li></Link>
            <Link to="/AdminDepartment" className='link-to'><li className='menu_item'>Кафедры</li></Link>
            <Link to="/AdminStud" className='link-to'><li className='menu_item'>Студенты</li></Link>
            <Link to="/AdminGroup" className='link-to'><li className='menu_item'>Группы</li></Link>
            <Link to="/AdminDirection" className='link-to'><li className='menu_item'>Направления</li></Link>
          </ul>
        </nav>

        {/* <Link to='/AdminUsers' className='admin-to-users'>Пользователи</Link> */}

        <Link style={{ visibility: 'hidden' }} className='admin-to-qr' to="/CreateQR">
          <p>Создать QR-код</p>
          <img className='qr-arrow' src={require('../../img/arrow.png')} />
        </Link>

        <Link to='/AdminAccount' className='admin-to-account'>Мой аккаунт</Link>
        <div className='admin-to-exit' onClick={handleLogout}>Выход</div>
      </div>

      <QRCode
        style={{ display: 'none' }}
        id="123456"
        value={`${qrUrl}`}
        size={290}
        level={"H"}
        includeMargin={true}
      />


      {/* блок фильтров и поиска */}
      <div className='qr-options'>

        {/* поиск */}
        <div className='data-option'>
          <div className='search'>
            <input type='text'
              value={inputValue}
              onChange={handleInputValue}
              placeholder='Поиск...' />
          </div>

          {/* фильтры */}
          <div className='filter-data-qr'>
            <Select
              styles={customStylesQR}
              placeholder="Семестр"
              value={semesterFilter}
              onChange={handleSelectSemesterFilter}
              isSearchable={true}
              // isDisabled={semesterFilter === -1 && directivityFilter !== null ? true : false}
              options={dataSemester}
            />
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
            />
            {/* задать заначения фильтрам */}
            <button className='get-params-qr' onClick={getParams} type='submit' ><FontAwesomeIcon icon={faFilter} /></button>
            {/* очистить фильтры */}
            <button className='delete-params-qr' onClick={deleteParams}><FontAwesomeIcon icon={faUndo} /></button>
          </div>
        </div>
      </div>

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
                document.body.style.overflow = 'hidden';


                setIdProgram(value.program.id);
                setDirectivityId(value.directivity.id);
                setEmptyModalActive(true)
              }}>
                <img src={require('../../img/qr_white.png')} />
              </button>
              <button onClick={() => {
                document.body.style.overflow = 'hidden';
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
          </div>
          <div className='modal-button'>
            <button onClick={() => {
              getQR();
              setEmptyModalActive(false);
              document.body.style.overflow = 'auto';


            }}>Сгенерировать</button>

            <button onClick={() => {
              setEmptyModalActive(false);
              document.body.style.overflow = 'auto';

            }}>Отмена</button>
          </div>
        </div>
      </Empty_modal>


      <Empty_modal active={editModalActive} setActive={setEditModalActive}>
        <div className='modal-disciplines'>
          <p><b>{titleProgram}</b></p>
          <div className='add-content'>
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
            <button onClick={() => {
              addDiscipline();
            }}>
              <FontAwesomeIcon icon={faCheckCircle} />
            </button>
          </div>
          <div className='edit-conteiner'>

            {searchResults !== null ? (
              searchResults.find(res => res.program.id === idProgram)?.disciplines.map(val => (
                <>
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
                    <button onClick={() => {
                      deleteData(val.id);
                    }}>
                      <FontAwesomeIcon icon={faXmarkCircle} />
                    </button>
                  </div></>
              ))
            ) : ''}
          </div>

          <div className='modal-button'>
            <button onClick={() => {
              // Здесь можно отправить данные на сервер или выполнить другие действия для сохранения данных
              console.log('Сохраненные данные:', editTypes);
              setEditModalActive(false);
              document.body.style.overflow = 'auto';
            }}>Сохранить</button>
            <button onClick={() => {
              setSearchResults(programQR)
              setEditModalActive(false);
              document.body.style.overflow = 'auto';
            }}>Отмена</button>
          </div>
        </div>
      </Empty_modal>




      {/* модальное окно ошибки */}
      <Error_modal active={errorActive} setActive={setErrorActive} text={textError} setText={setTextError} />
    </>
  )
}

export default CreateQR