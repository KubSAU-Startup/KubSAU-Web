import React, { useEffect, useState } from 'react';
import './Admin_header.css';
import './CreateQR.css'
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Select from 'react-select';
import QRCode from 'qrcode';
import JSZip, { filter } from "jszip";
import Modal from '../Modal/Modal';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loading from '../Modal/Loading';
import { getDataForQR } from '../../network';
import { getTextError } from '../../network';
import Error_modal from '../Modal/Error_modal';
import { saveAs } from 'file-saver';

const endpoint = 'https://jsonplaceholder.typicode.com/users';

function CreateQR() {
  const [isOpen, setOpen] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [userStates, setUserStates] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const [dataQR, setDataQR] = useState({
    response: {
      programs: [],
      groups: []
    },
    error: null,
    success: true
  });

  const [errorActive, setErrorActive] = useState(false);
  const [textError, setTextError] = useState('');

  const [semester, setSemester] = useState(-1);
  const [program, setProgram] = useState(null);
  const [group, setGroup] = useState(null);
  const [qrCodeText, setQRCodeText] = useState('');

  const [semesterFilter, setSemesterFilter] = useState(null);
  const [programFilter, setProgramFilter] = useState(null);

  const [getSemester, setGetSemester] = useState(null);
  const [getDirection, setGetDirection] = useState(null);
  const [getSubject, setGetSubject] = useState(null);


  useEffect(() => {
    getDataForQR((res) => {
      if (res.error) {
        setTextError(getTextError(res.error));
        setErrorActive(true);
        setIsLoading(false);

      } else {
        setDataQR(res);
        setIsLoading(false);
      }
    })

    const fetchData = async () => {
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        setAllUsers(data);
        setFilteredUsers(data);

        const initialUserStates = {};
        data.forEach(user => {
          initialUserStates[user.id] = false;
        });
        setUserStates(initialUserStates);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    const filtered = allUsers.filter(user =>
      user.address.zipcode.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleSettingClick = (userId) => {
    setUserStates(prevUserStates => ({
      ...prevUserStates,
      [userId]: !prevUserStates[userId],
    }));
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };
  if (isAuthenticated == false) {
    return <Navigate to='/Log' />
  }

  function handleSelectSemester(data) {
    setSemester(data);
  }
  function handleSelectProgram(data) {
    setProgram(data);
  }
  function handleSelectGroup(data) {
    setGroup(data);
  }

  const generateQRCode = async (studentId, subjectId) => {

    const qrContent = `${studentId},${subjectId}`;
    const qrUrl = await QRCode.toDataURL(qrContent);
    return qrUrl;

  };

  const getQR = async () => {

    setIsLoading(true);

    const zip = new JSZip();
    const folder = zip.folder(`${group.label}`);

    for (const gr of dataQR.response.groups) {
      if (gr.id === group.value) {

        for (const stud of gr.students) {
          const studentFolder = folder.folder(`${stud.lastName}_${stud.firstName}_${stud.middleName}`);

          for (const prog of dataQR.response.programs) {
            if (prog.id === program.value) {

              for (const disc of prog.disciplines) {
                const qrCodeUrl = await generateQRCode(stud.id, disc.id);
                const response = await fetch(qrCodeUrl);
                const qrCodeBlob = await response.blob();

                studentFolder.file(`${disc.title}.png`, qrCodeBlob);
              }
            }
          }
        }
      }
    }
    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, `${group.label}.zip`);
    });
    setIsLoading(false);

  };

  function handleSelectSemesterFilter(data) {
    setSemesterFilter(data);
  }
  function handleSelectProgramFilter(data) {
    setProgramFilter(data);
  }

  function handelGetSemester(data) {
    setGetSemester(data);
  }

  function handelGetDirection(data) {
    setGetDirection(data);
  }

  function handelGetSubject(data) {
    setGetSubject(data);
  }

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      fontSize: '14px',
      color: state.isSelected ? 'white' : 'green',
      backgroundColor: state.isSelected ? 'green' : 'white',
      cursor: 'pointer',
      border: 'none',
      '&:hover': {
        backgroundColor: 'green',
        color: 'white',
      },
      ...(state.isActive && {
        border: 'none',
        boxShadow: '0 0 0 2px green',
      }),

    }),
    control: (provided) => ({
      ...provided,

      minWidth: '150px',
      border: 'none',
      boxShadow: '0 0 0 2px green',
      margin: '0px 20px 0px 0px'
    }),
    menu: (provided) => ({
      ...provided,
      width: '100%',
    }),
  };
  const customStylesModal = {
    option: (provided, state) => ({
      ...provided,
      fontSize: '14px',
      color: state.isSelected ? 'white' : 'green',
      backgroundColor: state.isSelected ? 'green' : 'white',
      cursor: 'pointer',
      border: 'none',
      '&:hover': {
        backgroundColor: 'green',
        color: 'white',
      },
      ...(state.isActive && {
        border: 'none',
        boxShadow: '0 0 0 2px green',
      }),

    }),
    control: (provided) => ({
      ...provided,

      width: '400px',
      border: 'none',
      boxShadow: '0 0 0 2px green',
      margin: '20px'
    }),
    menu: (provided) => ({
      ...provided,
      width: '100%',
    }),
  };
  return (
    <>
      <Loading active={isLoading} setActive={setIsLoading} />

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
      <div className='qr-options'>
        <div className='create-qr'>
          <h2>Создать QR-код</h2>
          <p>Выберите последовательно:</p>
          <div className='filter-qr'>
            <Select
              styles={customStyles}
              placeholder="Семестр"
              value={semester}
              onChange={handleSelectSemester}
              isSearchable={true}
              options={[{ value: 1, label: 1 },
              { value: 2, label: 2 },
              { value: 3, label: 3 },
              { value: 4, label: 4 },
              { value: 5, label: 5 },
              { value: 6, label: 6 },
              { value: 7, label: 7 },
              { value: 8, label: 8 },
              { value: 9, label: 9 },
              { value: 10, label: 10 },
              { value: 11, label: 11 }
              ]}
            />
            <Select
              styles={customStyles}
              placeholder="Программа"
              value={program}
              onChange={handleSelectProgram}
              isSearchable={true}
              isDisabled={semester !== -1 ? false : true}
              options={dataQR.response.programs.filter(programs => programs.semester === semester.value).map(programs => ({
                value: programs.id,
                label: programs.title,
              }))}
            />
            <Select
              styles={customStyles}
              placeholder="Группа"
              value={group}
              onChange={handleSelectGroup}
              isSearchable={true}
              isDisabled={(semester !== -1 && program !== null) ? false : true}
              options={dataQR.response.groups.map(groups => ({
                value: groups.id,
                label: groups.title,
              }))}
            />

            <button className='btn-create-qr' onClick={getQR} disabled={(semester !== null && program !== null && group !== null) ? false : true}>
              Создать QR
              <img src={require('../../img/qr_white.png')} />
            </button>
          </div>
        </div>
        <div className='data-option'>
          <div className='search'>
            <input type='text'
              value={searchTerm}
              onChange={handleChange}
              placeholder='Поиск по направлению...' />
          </div>
          <div className='filter-data-qr'>
            <Select
              styles={customStyles}
              placeholder="Семестр"
              value={semesterFilter}
              onChange={handleSelectSemesterFilter}
              isSearchable={true}
              options={[{ value: 1, label: 1 },
              { value: 2, label: 2 },
              { value: 3, label: 3 },
              { value: 4, label: 4 },
              { value: 5, label: 5 },
              { value: 6, label: 6 },
              { value: 7, label: 7 },
              { value: 8, label: 8 },
              { value: 9, label: 9 },
              { value: 10, label: 10 },
              { value: 11, label: 11 }
              ]}
            />
            <Select
              styles={customStyles}
              placeholder="Программа"
              value={programFilter}
              onChange={handleSelectProgramFilter}
              isSearchable={true}
              options={dataQR.response.programs.map(programs => ({
                value: programs.id,
                label: programs.title,
              }))}
            />
            {/* onClick={() => setModalActive(true) */}

            <button className='get-params-qr' type='submit' ><FontAwesomeIcon icon={faFilter} /></button>
            <button className='delete-params-qr' ><FontAwesomeIcon icon={faUndo} /></button>

          </div>
        </div>
      </div>
      <button className='add-qr-group' onClick={() => setModalActive(true)}>
        {/* <img src={require('../../img/add.png')} alt='add' /> */}
        <FontAwesomeIcon icon={faPlusCircle} />
      </button>
     
      {dataQR.response.programs.map(programs => (
        <div className='cart-qr-group' key={programs.id}>
          <div className='data-qr'>
            <div className='qr1'>
              <p><span>Семестр: </span>{programs.semester}</p>
              <p><span>Программа: </span>{programs.title}</p>
            </div>

            <div className='qr2'>
              <span>Дисциплины: </span>
              <div className='dicip'>
                {programs.disciplines.map(disciplines => (
                  <p> {disciplines.title}</p>
                ))}

              </div>

            </div>
          </div>
          <button
            className='qr-setting'
            onClick={() => handleSettingClick(programs.id)}
          >
            <img src={require('../../img/setting.png')} alt='setting' />
          </button>
          <div className={`button-edit-delete ${userStates[programs.id] ? 'active' : ''}`}>
            <button>
              <img src={require('../../img/edit.png')} alt='edit' />
            </button>
            <button>
              <img src={require('../../img/delete.png')} alt='delete' />
            </button>
          </div>
        </div>
      ))}
      <Modal active={modalActive} setActive={setModalActive}>
        <div className='modal-qr'>
          <Select
            styles={customStylesModal}
            placeholder="Семестр"
            value={getSemester}
            onChange={handelGetSemester}
            isSearchable={true}
            options={[{ value: 1, label: 1 },
            { value: 2, label: 2 },
            { value: 3, label: 3 },
            { value: 4, label: 4 },
            { value: 5, label: 5 },
            { value: 6, label: 6 },
            { value: 7, label: 7 },
            { value: 8, label: 8 },
            { value: 9, label: 9 },
            { value: 10, label: 10 },
            { value: 11, label: 11 }
            ]}
          />
          <Select
            styles={customStylesModal}
            placeholder="Программа"
            value={getDirection}
            onChange={handelGetDirection}
            isSearchable={true}
            options={dataQR.response.programs.map(programs => ({
              value: programs.id,
              label: programs.title
            }))}
          />
          <Select
            styles={customStylesModal}
            placeholder="Дисциплины"
            value={getSubject}
            onChange={handelGetSubject}
            isSearchable={true}
            isMulti={true}
            options={dataQR.response.programs.map(programs => ({
              value: programs.id,
              label: programs.title
            }))}
          />
        </div>
      </Modal>
      <Error_modal active={errorActive} setActive={setErrorActive} text={textError} setText={setTextError} />

    </>



  )
}

export default CreateQR