import React,{createContext,useContext,useState,useEffect} from 'react';

const NodeContext = createContext();

export const NodeProvider =({children}) =>{
    const [nodeData,setNodeData] = useState([]);
        
    //function to generate dates in the format mmddyyyy for the month and year selected
        const generateDates=(month,year)=>{
          const daysInMonth = new Date(year,month,0).getDate();
          const formattedMonth = String(month);
          const formattedYear = String(year);
  
          const dates =[];
          for(let i=1;i<=daysInMonth;i++){
              const formattedDay = String(i);
              const date =parseInt(`${formattedMonth}${formattedDay}${formattedYear}`);
              dates.push(date);
          }
          return dates;
      }

    useEffect(()=>{
        //sample list
    const nodeData = 
    [
    ];
    setNodeData(nodeData);
      },[]);

    return <NodeContext.Provider value={{nodeData,setNodeData,generateDates}}>{children}</NodeContext.Provider>;
};

export const useNodeContext =()=>{
    return useContext(NodeContext);
};