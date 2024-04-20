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

      minWidth: '200px',
      maxWidth: '200px',
      border: 'none',
      boxShadow: '0 0 0 2px green',
      margin: '0px 10px 0px 0px'
    }),
    menu: (provided) => ({
      ...provided,
      width: '100%',
    }),
  };

  const customStylesQR = {
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

      minWidth: '130px',
      maxWidth: '130px',
      border: 'none',
      boxShadow: '0 0 0 2px green',
      margin: '0px 10px 0px 0px'
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
      margin: '10px 0'
    }),
    menu: (provided) => ({
      ...provided,
      width: '100%',
    }),
  };

  const customStylesTypeOfWork = {
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

      width: '220px',
      border: 'none',
      boxShadow: '0 0 0 2px green',
      margin: '10px 0'
    }),
    menu: (provided) => ({
      ...provided,
      width: '100%',
    }),
  };

  export {customStyles, customStylesModal, customStylesQR, customStylesTypeOfWork}