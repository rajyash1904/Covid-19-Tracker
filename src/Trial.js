import { useEffect, useState} from "react";

function MyButton(props){
    console.log('my button render');
    return (
        <button onClick={props.onClick}>Increment</button>
    ); 
}
function Show(props){
    console.log('my display render');
    console.log(props.width);
    const myStyle = {
        'marginLeft' : props.width + 'px',
    };
    return (
        <div style={myStyle}>{props.count}</div>
    );
}
const delay = 5;
export function Trial(){
    const [cnt,setCnt] = useState(0);
    const [width, setWidth] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => {
            setWidth(width => width + 10);
        }, delay * 100);
        return () => clearInterval(timer);
    }, []);

    function onClk() {
        setCnt(c => c + 1);
    }
    console.log('render');
    return (
        <>
            <Show count = {cnt} width={width}/>
            <MyButton onClick={onClk}/>
        </>
    );
}