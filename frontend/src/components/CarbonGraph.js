import React,{useEffect,useRef} from 'react';
import {Chart} from 'chart.js/auto';

const CarbonGraph =({data,onIntervalClick,calculateCarbon}) =>{
    const chartRef = useRef(null);

    useEffect(()=>{
        if(chartRef.current){
            if(chartRef.current.chart){
                chartRef.current.chart.destroy();
            }
    const maxCarbon = data?Math.max(...data.map((node)=>(node.CMass))):0;
    const minCarbon = data?Math.min(...data.map((node)=>(node.CMass))):0;

    //using intervals of 10 lb for scale
    const intervalWidth = 10;

    const numIntervals = Math.ceil((maxCarbon-minCarbon)/intervalWidth);
    const intervals = Array.from({length:numIntervals},(_,index)=>({
        min: minCarbon + index * intervalWidth,
        max: minCarbon + (index+1) * intervalWidth,
        count:0,
    }));

    //find number of nodes for each interval
    data.forEach((node)=>{
        const CMass = node.CMass;
        const interval = intervals.find((i)=> CMass >= i.min && CMass < i.max);
        if(interval){
            interval.count++;
        }
    });



    const labels = intervals.map((interval)=> `${interval.min.toFixed(1)}-${interval.max.toFixed(1)}`);
    const counts = intervals.map((interval)=>interval.count);

    const ctx=chartRef.current.getContext('2d');
    chartRef.current.chart = new Chart(ctx,{
        type: 'bar',
        data:{
            labels: labels,
            datasets: [
                {
                    label: 'Node Count',
                    data: counts,
                    borderWidth:1,
                },
            ],
        },
        options:{
            scales: {
                x: {
                    type: 'category',
                    title:{
                        display: true,
                        text: 'Carbon Mass',
                    },
                },
                y:{
                    beginAtZero: true,
                    title:{
                        display: true,
                        text: 'Node Count',
                    },
                },
            },
            onClick: (event,elements)=>{
                if(elements.length>0){
                    const index = elements[0].index;
                    const interval= intervals[index];
                    onIntervalClick(interval);
                }
            }
        },
    });
}
    },[data,onIntervalClick]);
    
    return <canvas ref={chartRef} />;
};

export default CarbonGraph;