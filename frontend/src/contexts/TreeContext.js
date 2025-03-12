import React,{createContext,useContext,useState,useEffect} from 'react';

const TreeContext = createContext();

export const TreeProvider =({children}) =>{
    const [treeData,setTreeData] = useState([]);

    useEffect(()=>{
        //sample list
    const treeData = 
    [
    ];
    setTreeData(treeData);
      },[]);

    return <TreeContext.Provider value={{treeData,setTreeData}}>{children}</TreeContext.Provider>;
};

export const useTreeContext =()=>{
    return useContext(TreeContext);
};