import React, {createContext,useContext,useState} from 'react';

const DateContext = createContext();

//by default the previous month data is selected
const getPreviousMonth = () =>{
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth()-1);
    return currentDate.getMonth()+1;
};

const getCurrentYear =()=>{
    return new Date().getFullYear();
};

export const DateProvider = ({children}) => {
    const [month,setMonth] = useState(getPreviousMonth());
    const [year,setYear] = useState(getCurrentYear());

    return(
        <DateContext.Provider value={{month,setMonth,year,setYear}}>
            {children}
        </DateContext.Provider>

    );
};

export const useDateContext =()=>{
    return useContext(DateContext);
};
