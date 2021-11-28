import App from "./../App";
import './Home.css';
import 'animate.css';

export function NavBar(props){
    return (
        <div className="Home animate__animated animate__backInDown">
            <button className="NavButton">Home</button>
            <button className="NavButton">Vaccine</button>
            <button className="NavButton">About</button>
        </div>
    );
}

function Home(props){
    return (
        <>
            <NavBar/>
            <App/>
        </>
    );
}

export default Home;