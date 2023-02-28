const useSelectTheme = (darkMode, width = '200px', justifySelf = "auto") => {
  return {
    control: styles => ({ 
      ...styles, 
      backgroundColor: 'transperent',
      border: darkMode ? '1px solid #ECEAEA !important' : '1px solid #141414 !important',
      boxShadow: 0,
      width: width,
      minHeight: "40px",
      justifySelf: justifySelf
    }),
    singleValue: styles => ({ 
      ...styles, 
      backgroundColor: 'transperent' ,
      color: darkMode ? '#ECEAEA !important' : '#141414 !important',
      fontFamily: 'Roboto Condensed'
    }),
    option: styles =>  ({
      ...styles,
      padding: "4px 8px",
      backgroundColor:'transperent',
      color: darkMode ? '#ECEAEA !important' : '#141414 !important',
      fontFamily: 'Roboto Condensed',
      "&:hover": {
        backgroundColor: darkMode ? "#292929 !important" : "#C2C2C2 !important"
      }
    }),
    menu: styles =>({
      ...styles,
      backgroundColor: darkMode ? '#1F1F1F !important' : '#F4F4F6 !important',
      border: darkMode ? '1px solid #ECEAEA !important' : '1px solid #141414 !important',
      zIndex:1000000,
      position: 'absolute',
    }),
    dropdownIndicator: styles => ({
      ...styles,
      color: darkMode ? '#ECEAEA !important' : '#141414 !important',
    }),
    indicatorSeparator: styles => ({
      ...styles,
      backgroundColor: darkMode ? '#ECEAEA !important' : '#141414 !important',
    }),
    multiValue: styles => ({
      ...styles,
      backgroundColor: darkMode ? '#ECEAEA !important' : '#141414 !important',
      color: darkMode ? '#141414 !important' : '#ECEAEA !important',
      fontFamily: 'Roboto Condensed',
    }),
    multiValueLabel: styles => ({
      ...styles,
      backgroundColor: darkMode ? '#ECEAEA !important' : '#141414 !important',
      color: darkMode ? '#141414 !important' : '#ECEAEA !important',
      fontFamily: 'Roboto Condensed',
      fontSize: '14px',
      padding: "1px 2px",
      width: 'max-content',
      borderRadius: '4px'
    }),
    clearIndicator: styles => ({
      ...styles,
      color: darkMode ? '#ECEAEA !important' : '#141414 !important',
    }),
    multiValueRemove: styles => ({
      ...styles,
      color: darkMode ? '#141414 !important' : '#ECEAEA !important',
      "&:hover": {
        backgroundColor: darkMode ? "#C2C2C2 !important" : "#292929 !important"
      }
    }),
    menuPortal: styles => ({
      ...styles,
      zIndex: 1000
    }),
  }
}
  
export default useSelectTheme